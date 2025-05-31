# stability_toolkit.py

from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool, BaseToolkit
import requests
import json

# ---- Tool 1: Write ZKTv1 message ----
def post_zkt_v1(arguments: str, api_key: str = "try-it-out") -> str:
    url = f"https://rpc.stabilityprotocol.com/zkt/{api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {"arguments": arguments}
    try:
        response = requests.post(url, headers=headers, json=payload)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# ---- Tool 2: Smart contract read ----
def call_contract_read(to: str, abi: list, method: str, arguments: list, id=1, api_key: str = "try-it-out") -> str:
    url = f"https://rpc.stabilityprotocol.com/zkt/{api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "to": to,
        "abi": abi,
        "method": method,
        "arguments": arguments,
        "id": id
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# ---- Tool 3: Smart contract write ----
def call_contract_write(to: str, abi: list, method: str, arguments: list, id=1, wait=False, api_key: str = "try-it-out") -> str:
    url = f"https://rpc.stabilityprotocol.com/zkt/{api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "to": to,
        "abi": abi,
        "method": method,
        "arguments": arguments,
        "id": id,
        "wait": wait
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# ---- Tool 4: Deploy contract ----
def deploy_contract(code: str, arguments: list = [], id=1, api_key: str = "try-it-out") -> str:
    url = f"https://rpc.stabilityprotocol.com/zkt/{api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "code": code,
        "arguments": arguments,
        "id": id
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# ---- LangChain tool wrappers ----
write_tool = Tool(
    name="StabilityWriteTool",
    func=lambda args: post_zkt_v1(args),
    description="Send a plain text message to the Stability blockchain using ZKT v1."
)

read_tool = Tool(
    name="StabilityReadTool",
    func=lambda args: call_contract_read(**json.loads(args)),
    description="Read data from a Stability smart contract using ZKT v2 read request. JSON input must include: to, abi, method, arguments."
)

write_contract_tool = Tool(
    name="StabilityWriteContractTool",
    func=lambda args: call_contract_write(**json.loads(args)),
    description="Write data to a Stability smart contract using ZKT v2 write request. JSON input must include: to, abi, method, arguments, id, wait."
)

deploy_tool = Tool(
    name="StabilityDeployTool",
    func=lambda args: deploy_contract(**json.loads(args)),
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
if __name__ == "__main__":
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    toolkit = StabilityToolkit()
    agent = initialize_agent(toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

    prompt = "Deploy a smart contract that stores a greeting and value, then return the contract address."
    result = agent.run(prompt)
    print("\nAgent Result:")
    print(result)
