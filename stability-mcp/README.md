# Stability MCP Ecosystem

A complete Model Context Protocol (MCP) implementation for Stability blockchain, enabling AI agents to interact with Stability Protocol without gas fees.

## 🏗️ Architecture

```
stability-mcp/
├─ contracts/          # Solidity smart contracts + Foundry setup
├─ host/               # Node.js orchestrator for MCP hosts
├─ servers/            # MCP server implementations & Docker images
├─ sdk/                # @stbl/mcp - JavaScript/TypeScript SDK
├─ dashboard/          # React SPA for monitoring & management
└─ docs/               # Specifications, ADRs, tutorials
```

## 🎯 What This Provides

### **MCP Server** (`servers/`)
- **Single executable** that provides Stability blockchain tools
- **Docker images** for easy deployment
- **Tools provided:**
  - `post_message` - Post messages to blockchain
  - `read_contract` - Read from smart contracts
  - `write_contract` - Write to smart contracts
  - `deploy_contract` - Deploy new contracts

### **SDK** (`sdk/`)
- **`@stbl/mcp`** - TypeScript/JavaScript package
- **Easy integration** with existing MCP hosts
- **Type-safe** interfaces for all tools

### **Host Orchestrator** (`host/`)
- **Node.js application** that can run MCP servers
- **Management interface** for multiple MCP instances
- **Health checking** and monitoring

### **Smart Contracts** (`contracts/`)
- **Foundry project** with Stability Protocol contracts
- **Test contracts** for development
- **Deployment scripts**

### **Dashboard** (`dashboard/`)
- **React SPA** for monitoring MCP servers
- **Real-time** blockchain interaction logs
- **Management interface** for API keys and configuration

## 🚀 Quick Start

### 1. Install the SDK
```bash
npm install @stbl/mcp
```

### 2. Run the MCP Server
```bash
docker run -e STABILITY_API_KEY=your-key stbl/mcp-server
```

### 3. Use with Claude Desktop
```json
{
  "mcpServers": {
    "stability": {
      "command": "docker",
      "args": ["run", "-e", "STABILITY_API_KEY=your-key", "stbl/mcp-server"]
    }
  }
}
```

## 📦 Components

| Component | Purpose | Language | Status |
|-----------|---------|----------|--------|
| `servers/` | MCP Server implementation | Python | 🔧 In Progress |
| `sdk/` | TypeScript SDK | TypeScript | 📋 Planned |
| `host/` | Node.js orchestrator | Node.js | 📋 Planned |
| `contracts/` | Smart contracts | Solidity | 📋 Planned |
| `dashboard/` | Management UI | React | 📋 Planned |
| `docs/` | Documentation | Markdown | 📋 Planned |

## 🔧 Development

### Prerequisites
- Python 3.8+
- Node.js 18+
- Docker
- Foundry (for contracts)

### Setup
```bash
# Install dependencies
pip install -r servers/requirements.txt
npm install

# Run tests
python -m pytest servers/tests/
npm test

# Build Docker images
docker build -t stbl/mcp-server servers/
```

## 🎯 Why This Architecture?

### **Simplified MCP Implementation**
- **Single MCP server** instead of complex client/server separation
- **Docker-first** deployment for easy integration
- **SDK** for developers who want to integrate directly

### **Complete Ecosystem**
- **Not just a server** - complete tooling and infrastructure
- **Production-ready** with monitoring, management, and deployment
- **Developer-friendly** with good documentation and examples

### **Real-world Usage**
- **Works with Claude Desktop** out of the box
- **Integrates with OpenAI** and other MCP hosts
- **Scalable** for enterprise deployments

## 🔗 Related Projects

- [Stability Protocol](https://stabilityprotocol.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Stability Toolkit](../stability_toolkit.py) - Core Python library

## 📄 License

MIT License - see [LICENSE](LICENSE) for details. 