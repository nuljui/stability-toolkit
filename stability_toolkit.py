# stability_toolkit.py

"""Core Stability Toolkit implementation."""

from typing import Any, List
import json

DEFAULT_API_KEY = "try-it-out"
API_URL_TEMPLATE = "https://rpc.stabilityprotocol.com/zkt/{}"
HEADERS = {"Content-Type": "application/json"}

__all__ = [
    "post_zkt_v1",
    "call_contract_read",
    "call_contract_write",
    "deploy_contract",
    "StabilityToolkit",
]

try:
    import requests
except Exception:  # pragma: no cover - optional dependency
    class _RequestsFallback:
        def post(self, *_, **__):  # pragma: no cover - fallback implementation
            raise RuntimeError("requests library is required")

    requests = _RequestsFallback()  # type: ignore


def _post_request(payload: dict, api_key: str = DEFAULT_API_KEY) -> str:
    """Send a POST request to the Stability API and return the response text."""
    url = API_URL_TEMPLATE.format(api_key)
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        return response.text
    except Exception as e:  # pragma: no cover - network failures
        return f"Error: {e}"

try:  # Optional import so tests don't require langchain
    from langchain.tools import Tool, BaseToolkit
    from langchain.chat_models import ChatOpenAI
    from langchain.agents import initialize_agent, AgentType
    _LANGCHAIN_AVAILABLE = True
except Exception:  # pragma: no cover - optional dependency
    class Tool:
        def __init__(self, name: str = "", func=None, description: str = ""):
            self.name = name
            self.func = func
            self.description = description

    class _BaseToolkitFallback:
        def get_tools(self):
            return []

    BaseToolkit = _BaseToolkitFallback
    ChatOpenAI = initialize_agent = AgentType = None  # type: ignore
    _LANGCHAIN_AVAILABLE = False

# ---- Tool 1: Write ZKTv1 message ----
def post_zkt_v1(arguments: str, api_key: str = DEFAULT_API_KEY) -> str:
    """Send a simple string message to the blockchain."""
    payload = {"arguments": arguments}
    return _post_request(payload, api_key)

# ---- Tool 2: Smart contract read ----
def call_contract_read(
    to: str,
    abi: List[str],
    method: str,
    arguments: List[Any],
    id: int = 1,
    api_key: str = DEFAULT_API_KEY,
) -> str:
    """Execute a read-only smart contract call."""
    payload = {
        "to": to,
        "abi": abi,
        "method": method,
        "arguments": arguments,
        "id": id,
    }
    return _post_request(payload, api_key)

# ---- Tool 3: Smart contract write ----
def call_contract_write(
    to: str,
    abi: List[str],
    method: str,
    arguments: List[Any],
    wait: bool = True,
    id: int = 1,
    api_key: str = DEFAULT_API_KEY,
) -> str:
    """Execute a state-changing smart contract call."""
    payload = {
        "to": to,
        "abi": abi,
        "method": method,
        "arguments": arguments,
        "id": id,
        "wait": wait,
    }
    return _post_request(payload, api_key)

# ---- Tool 4: Deploy contract ----
def deploy_contract(
    code: str,
    arguments: List[Any] | None = None,
    wait: bool = False,
    id: int = 1,
    api_key: str = DEFAULT_API_KEY,
) -> str:
    """Deploy a Solidity contract to the blockchain."""
    payload = {
        "code": code,
        "arguments": arguments or [],
        "wait": wait,
        "id": id,
    }
    return _post_request(payload, api_key)

# ---- LangChain tool wrappers ----
write_tool = Tool(
    name="StabilityWriteTool",
    func=lambda arguments: post_zkt_v1(arguments),
    description="Send a plain text message to the Stability blockchain using ZKT v1."
)

read_tool = Tool(
    name="StabilityReadTool",
    func=lambda arguments: call_contract_read(**json.loads(arguments)),
    description="Read data from a Stability smart contract using ZKT v2 read request. JSON input must include: to, abi, method, arguments."
)

write_contract_tool = Tool(
    name="StabilityWriteContractTool",
    func=lambda arguments: call_contract_write(**json.loads(arguments)),
    description="Write data to a Stability smart contract using ZKT v2 write request. JSON input must include: to, abi, method, arguments, id, wait."
)

deploy_tool = Tool(
    name="StabilityDeployTool",
    func=lambda arguments: deploy_contract(**json.loads(arguments)),
    description="Deploy a Solidity smart contract to the Stability blockchain. JSON input must include: code, arguments."
)

# ---- Toolkit class ----
class StabilityToolkit(BaseToolkit):
    def get_tools(self):
        return [
            write_tool,
            read_tool,
            write_contract_tool,
            deploy_tool
        ]

# ---- Agent + Example usage ----
if __name__ == "__main__" and _LANGCHAIN_AVAILABLE:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    toolkit = StabilityToolkit()
    agent = initialize_agent(
        toolkit.get_tools(),
        llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
    )

    prompt = (
        "Deploy a smart contract that stores a greeting and value, then return the contract address."
    )
    result = agent.run(prompt)
    print("\nAgent Result:")
    print(result)
