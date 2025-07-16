# STBL-MCP: Stability Model Context Protocol

A complete Model Context Protocol (MCP) implementation for Stability blockchain, enabling AI agents to interact with Stability Protocol without gas fees. Features comprehensive blockchain tools and real-time event monitoring.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ or Node.js 18+
- Claude Desktop or other MCP-compatible client
- Optional: Free API key from [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com)

### Installation

```bash
git clone https://github.com/yourusername/stbl-mcp.git
cd stbl-mcp

# Python server
pip install -r requirements.txt

# OR Node.js server (TypeScript)
cd servers/node
npm install
npm run build
```

### Usage with Claude Desktop

1. **Set API Key** (optional):
   ```bash
   export STABILITY_API_KEY="your-api-key-here"
   ```

2. **Configure Claude Desktop** by adding to your config file:
   ```json
   {
     "mcpServers": {
       "stability": {
         "command": "python3",
         "args": ["/path/to/stbl-mcp/stability_mcp.py"]
       }
     }
   }
   ```

3. **Start using** the 10 blockchain and event tools in Claude Desktop!

## 🛠️ Available Tools

### Blockchain Tools (4)

#### 1. `stbl_write` (post_message)
Post plain text messages to the Stability blockchain
```json
{
  "message": "Hello from AI agent!"
}
```

#### 2. `stbl_read` (read_contract)
Read data from smart contracts
```json
{
  "to": "0x1234...",
  "method": "balanceOf",
  "arguments": ["0x5678..."],
  "abi": "[...]"
}
```

#### 3. `stbl_write_contract` (write_contract)
Execute state-changing contract calls
```json
{
  "to": "0x1234...",
  "method": "transfer",
  "arguments": ["0x5678...", 1000],
  "abi": "[...]",
  "wait": true
}
```

#### 4. `stbl_deploy` (deploy_contract)
Deploy new smart contracts
```json
{
  "code": "contract MyContract { ... }",
  "arguments": ["arg1", "arg2"],
  "wait": true
}
```

### Event Tools (6) ✨ NEW

#### 5. `event_subscribe`
Subscribe to real-time blockchain events
```json
{
  "type": "Transfer",
  "contract": "0x1234...",
  "autoConnect": true
}
```

#### 6. `event_status`
Get event system status and health monitoring
```json
{}
```

#### 7. `event_query`
Query historical events with advanced filtering
```json
{
  "limit": 50,
  "offset": 0,
  "startTime": 1640995200000,
  "sortBy": "timestamp",
  "sortOrder": "desc"
}
```

#### 8. `event_filter`
Create complex event filters with multiple conditions
```json
{
  "conditions": [
    {"field": "event", "operator": "equals", "value": "Transfer"},
    {"field": "value", "operator": "gt", "value": 1000000}
  ],
  "logicalOperator": "AND"
}
```

#### 9. `event_webhook`
Configure webhooks for external event notifications
```json
{
  "url": "https://api.example.com/webhook",
  "events": ["Transfer", "Approval"],
  "secret": "webhook-secret",
  "enabled": true
}
```

#### 10. `event_unsubscribe`
Clean up event subscriptions
```json
{
  "subscriptionId": "sub_1234567890"
}
```

## 📁 Project Structure

```
stbl-mcp/
├── stability_mcp.py           # Python MCP server
├── stability_toolkit.py       # Core Stability API integration
├── servers/                   # Multi-language MCP servers
│   └── node/                  # TypeScript/Node.js implementation
│       ├── src/
│       │   ├── index.ts       # Main MCP server
│       │   ├── tools.ts       # 10 MCP tools implementation
│       │   ├── events.ts      # Event subscription system
│       │   └── api.ts         # Stability API integration
│       ├── dist/              # Compiled JavaScript
│       └── package.json       # Node.js dependencies
├── tasks/                     # 28 development tasks breakdown
│   ├── 01-2-setup-nodejs-mcp-server.md ✅
│   ├── 02-3-migrate-python-tools-to-mcp.md ✅
│   ├── 05-4-build-event-subscription-system.md ✅
│   ├── 06-3-create-event-mcp-tools.md ✅
│   ├── 07-3-test-event-system.md ✅
│   └── ...
├── docs/                      # Original LangChain integration docs
├── test_*.py                  # Test files
├── requirements.txt           # Python dependencies
├── CLAUDE_DESKTOP_SETUP.md   # Detailed setup guide
└── README.md                 # This file
```

## 🎯 Features

- **Zero Gas Fees**: Use Stability's ZKT (Zero Knowledge Transaction) API
- **10 Comprehensive Tools**: Complete blockchain and event management
- **Real-time Events**: WebSocket-based event subscription system
- **Advanced Filtering**: Complex event queries with pagination and sorting
- **Webhook Integration**: External notifications with security
- **Dual Implementation**: Python and TypeScript/Node.js servers
- **Free API Key**: Get started immediately with try-it-out mode
- **Production Ready**: Supports production API keys
- **AI-First**: Designed specifically for AI agent integration
- **LangChain Compatible**: Built on existing LangChain toolkit

## 📋 Development Roadmap

This project includes **28 detailed development tasks** organized into 7 phases:

### Current Status (10/28 completed - 36%):
- ✅ **Phase 1**: Core MCP tools implementation (4 tasks)
- ✅ **Phase 2**: Event subscription system (3 tasks) ✨ NEW
- ⏳ **Phase 3**: Smart contract templates (5 tasks)
- ⏳ **Phase 4**: Token operations (3 tasks)
- ⏳ **Phase 5**: Testing & documentation (5 tasks)
- ⏳ **Phase 6**: Advanced AI features (3 tasks)
- ✅ **Phase 7**: Migration & compatibility (3 tasks)

### Recently Completed:
- ✅ **Task 5**: Build event subscription system with WebSocket foundation
- ✅ **Task 6**: Create 6 comprehensive event MCP tools
- ✅ **Task 7**: Test complete event system functionality

See the `tasks/` directory for detailed breakdown of each development task.

## 🔧 Configuration

### API Keys
- **Free**: Uses "try-it-out" by default (limited functionality)
- **Production**: Set `STABILITY_API_KEY` environment variable
- **Get Key**: Visit [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com)

### MCP Clients
- **Claude Desktop**: See `CLAUDE_DESKTOP_SETUP.md`
- **Other MCP clients**: Both servers use stdio protocol

### Server Options
- **Python**: `python stability_mcp.py` (4 blockchain tools)
- **Node.js**: `node servers/node/dist/index.js` (10 tools with events)

## 🧪 Testing

Run the test suite:
```bash
# Python tests
python -m pytest test_stability_toolkit_units.py
python -m pytest test_stability_toolkit_langchain.py
python -m pytest test_stability_toolkit_live.py

# Node.js tests
cd servers/node
npm test
node task7_test.js  # Event system validation
```

## 📚 Documentation

- **Setup Guide**: `CLAUDE_DESKTOP_SETUP.md`
- **Task Breakdown**: `tasks/README.md`
- **Event System**: `tasks/05-4-build-event-subscription-system.md`
- **Original Integration**: `docs/docs/integrations/tools/stability.ipynb`
- **Contributing**: `CONTRIBUTING.md`

## 🤝 Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines and the `tasks/` directory for specific development opportunities.

**High Priority Areas:**
- Phase 3: Smart contract templates
- Phase 4: Token operations (ERC-20, ERC-721)
- Phase 5: Testing and documentation

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🔗 Related Projects

- [Stability Protocol](https://portal.stabilityprotocol.com/) - Zero gas blockchain platform
- [Model Context Protocol](https://github.com/modelcontextprotocol/specification) - AI agent integration standard
- [LangChain](https://github.com/langchain-ai/langchain) - AI application framework

## 🎉 Get Started

1. **Clone this repo**
2. **Install dependencies**: `pip install -r requirements.txt` or `npm install`
3. **Follow**: `CLAUDE_DESKTOP_SETUP.md`
4. **Start building** AI agents with comprehensive blockchain capabilities!

---

**Made with ❤️ for the AI + Blockchain community** 

*Now featuring complete event system with real-time monitoring! 🚀*