# STBL-MCP Integration Guide for Cursor

A complete guide to integrate Stability blockchain tools with Cursor IDE using the Model Context Protocol (MCP).

## 🎯 What You'll Get

After setup, you'll have **6 powerful blockchain tools** available directly in Cursor:

### Blockchain Tools (4)
- **`stbl_write`** - Post messages to Stability blockchain (zero gas fees!)
- **`stbl_read`** - Read data from smart contracts  
- **`stbl_write_contract`** - Execute contract transactions
- **`stbl_deploy`** - Deploy new smart contracts

### Event Tools (2)
- **`event_subscribe`** - Subscribe to real-time blockchain events
- **`event_status`** - Monitor event system health

## 📋 Prerequisites

- **Cursor IDE** installed ([download here](https://cursor.sh/))
- **Node.js 18+** (for npm package) or **Python 3.8+** (for Python server)
- **Optional**: Free API key from [Stability Portal](https://portal.stabilityprotocol.com/)

## 🚀 Setup Options

### Option 1: NPM Package (Recommended - Coming Soon!)

**⚠️ Note**: Once published to npm, this will be the easiest method!

```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "npx",
      "args": ["-y", "stbl-mcp"],
      "env": {
        "STABILITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

That's it! Just like taskmaster-ai - no local installation needed.

### Option 2: Local Development (Current Method)

**Step 1: Clone & Install**

```bash
# Clone the STBL-MCP repository
git clone https://github.com/yourusername/stbl-mcp.git
cd stbl-mcp

# Node.js/TypeScript Server (Recommended - more features)
cd servers/node
npm install
npm run build
```

**Step 2: Configure Cursor**

Add this to `~/.config/cursor/mcp_servers.json` (Mac/Linux) or `%APPDATA%\Cursor\mcp_servers.json` (Windows):

```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "node",
      "args": ["/full/path/to/stbl-mcp/servers/node/dist/index.js"],
      "env": {
        "STABILITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Important**: Replace `/full/path/to/stbl-mcp` with your actual installation path.

### Option 3: Python Server (Alternative)

```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "python3",
      "args": ["/full/path/to/stbl-mcp/stability_mcp.py"],
      "env": {
        "STABILITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## ✅ Get Your API Key (Optional but Recommended)

1. Visit [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com/)
2. Sign up for a **free account**
3. Generate your **API key**
4. Add it to the configuration above

**Without an API key**, it uses "try-it-out" mode with limited functionality.

## 🔄 Restart Cursor

Close and restart Cursor to load the new MCP configuration.

## ✅ Verify Installation

### Test 1: Check Available Tools

In Cursor, open a new chat and ask:
```
What blockchain tools do you have available?
```

You should see a response mentioning the STBL-MCP tools.

### Test 2: Simple Blockchain Message

Try posting a message to the blockchain:
```
Use the stbl_write tool to post the message "Hello from Cursor!" to the Stability blockchain
```

### Test 3: Event System

Check the event system status:
```
Use the event_status tool to show me the current event system status
```

## 🛠️ Usage Examples

### Example 1: Reading Contract Data

```
I want to read the balance of address 0x742d35Cc6aBf4C1F14c5e6Ba47Cc06af7AE51234 from the USDC contract at 0xA0b86a33E6D9c16b9d0D0D3F8Bd3b6B8e54e2F4A. Use the stbl_read tool.
```

### Example 2: Deploying a Simple Contract

```
Deploy a simple ERC-20 token contract with the name "TestToken" and symbol "TEST" using the stbl_deploy tool. Use basic ERC-20 contract code.
```

### Example 3: Subscribing to Events

```
Subscribe to Transfer events from the contract 0xA0b86a33E6D9c16b9d0D0D3F8Bd3b6B8e54e2F4A using the event_subscribe tool
```

## 🐛 Troubleshooting

### Issue: "No blockchain tools available"

**Solutions:**
1. Check the MCP configuration file path is correct
2. Verify the command and args in the configuration
3. Restart Cursor completely
4. Check the console for error messages

### Issue: "API key errors"

**Solutions:**
1. Verify your API key is correct
2. Try removing the API key to use "try-it-out" mode
3. Check your internet connection
4. Visit [Stability Portal](https://portal.stabilityprotocol.com/) to verify your key

### Issue: "Module not found errors" (Local Development)

**Solutions:**
1. Run `npm install` in the `servers/node` directory
2. Run `npm run build` to compile TypeScript
3. For Python: Run `pip install -r requirements.txt`
4. Check that the absolute path is correct

### Issue: "Tools not responding"

**Solutions:**
1. Check if the MCP server process is running
2. Look for error messages in Cursor's developer console
3. Try the validation script: `python3 validate_mcp.py`

## 📊 What's Included

### Server Implementations
- **Node.js/TypeScript**: 6 tools (blockchain + events)
- **Python**: 4 tools (blockchain focused)

### Tool Capabilities
- **Zero Gas Fees**: All transactions use Stability's ZKT API
- **Real-time Events**: WebSocket-based event subscriptions
- **Smart Contract Support**: Read, write, and deploy contracts
- **Production Ready**: Tested and validated implementation

### Documentation
- Comprehensive setup guides
- Usage examples and tutorials
- Troubleshooting documentation
- API reference

## 🎉 You're All Set!

Once configured, you can:

1. **Ask Cursor** to interact with the Stability blockchain
2. **Deploy contracts** directly from your conversations
3. **Monitor events** in real-time
4. **Read contract data** with simple requests
5. **Post messages** to the blockchain with zero gas fees

### Example Conversation Starters:

- "Show me the current status of the event system"
- "Deploy a simple smart contract that stores a message"
- "Read the balance of [address] from [contract]"
- "Subscribe to Transfer events from [contract address]"
- "Post a message to the Stability blockchain saying 'Hello World'"

## 🔗 Additional Resources

- **GitHub Repository**: [stbl-mcp](https://github.com/yourusername/stbl-mcp)
- **Stability Protocol**: [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com/)
- **MCP Documentation**: [Model Context Protocol](https://github.com/modelcontextprotocol/specification)
- **Support**: Open an issue on the GitHub repository

---

## 🚀 Coming Soon: NPM Package

We're working on publishing STBL-MCP to npm, which will make setup as simple as:

```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "npx",
      "args": ["-y", "stbl-mcp"],
      "env": {
        "STABILITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Just like taskmaster-ai! Stay tuned for the npm release.

**Ready to revolutionize your blockchain development workflow with AI-powered tools!** 🚀 