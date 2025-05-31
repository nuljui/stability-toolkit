# Stability Toolkit for LangChain

**StabilityToolkit** is a LangChain-compatible toolkit that enables AI agents to interact directly with the [Stability Blockchain](https://stabilityprotocol.com) through Zero Gas Transaction (ZKT) API endpoints. It includes tools for submitting simple messages, interacting with smart contracts (read/write), and deploying contracts — all without requiring gas fees or cryptocurrency.

---

## 🚀 Features

* ✅ Write plain messages to Stability (ZKTv1)
* ✅ Read smart contract data (ZKTv2 Simple - view)
* ✅ Call smart contract functions (ZKTv2 Simple - write)
* ✅ Deploy new smart contracts (ZKTv2 Contract)
* ✅ Works with public and authenticated endpoints

---

## 🛠 Tools Overview

| Tool Name                    | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `StabilityWriteTool`         | POSTs a string message to the blockchain         |
| `StabilityReadTool`          | Reads data from smart contracts via ABI & method |
| `StabilityWriteContractTool` | Calls smart contract write methods               |
| `StabilityDeployTool`        | Deploys Solidity smart contracts to Stability    |

---

## 🧱 Installation

```bash
pip install langchain openai requests
```

---

## 🧪 Example Usage

```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from stability_toolkit import StabilityToolkit

llm = ChatOpenAI(model="gpt-4o", temperature=0)
toolkit = StabilityToolkit()
agent = initialize_agent(toolkit.get_tools(), llm, agent_type="zero-shot-react-description")

response = agent.run("Deploy a contract that stores a greeting and a value")
print(response)
```

---

## 🧪 Running Tests

```bash
python -m unittest test_stability_toolkit.py
```

---

## 🔐 API Keys

* Public endpoint: `https://rpc.stabilityprotocol.com/zkt/try-it-out`
* Get your free personal key at [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com)
* Replace `try-it-out` in URLs with your API key to sign with your own identity.

---

## 📄 API Docs

For full OpenAPI documentation, see:
[https://stabilityprotocol.github.io/stability-api-docs](https://stabilityprotocol.github.io/stability-api-docs)

---

## 💡 Contribution Ideas

* Add retry logic or exponential backoff
* Support transaction result polling with `wait=True`
* Extend Toolkit with `StatusTool` or `VerifyTool`
* Add automatic schema validation with `pydantic`

---

## 📬 Contact

For questions, feature requests, or contributions, reach out via [stabilityprotocol.com](https://stabilityprotocol.com)
