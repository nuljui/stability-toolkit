# Using Stability MCP with Claude Desktop

## Prerequisites

1. **Claude Desktop** - Download from [Claude.ai](https://claude.ai/download)
2. **Stability API Key** - Get free key from [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com)
3. **Python 3.8+**

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd stability-mcp/
pip install -r requirements.txt
```

### 2. Set API Key (Optional)

```bash
export STABILITY_API_KEY="your-api-key-here"
```

*(If you don't set this, it will use the "try-it-out" key with limited functionality)*

### 3. Configure Claude Desktop

**Find your config file:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Add this configuration:**

```json
{
  "mcpServers": {
    "stability": {
      "command": "python3",
      "args": ["/full/path/to/stability-mcp/stability_mcp.py"],
      "env": {
        "STABILITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Replace `/full/path/to/stability-mcp/` with the actual path to your directory.**

### 4. Restart Claude Desktop

After updating the config, restart Claude Desktop for changes to take effect.

## Usage

Once configured, you can ask Claude to:

- **Post messages**: "Post a message to the Stability blockchain saying 'Hello from Claude!'"
- **Deploy contracts**: "Deploy a simple storage contract to Stability"
- **Read contracts**: "Read the message from contract address 0x..."
- **Write to contracts**: "Call the setValue method on contract 0x... with value 42"

## Example Conversation

**You**: "Use the Stability tools to deploy a simple contract that stores a greeting message."

**Claude**: *Uses the `deploy_contract` tool to deploy a Solidity contract*

**You**: "Now read the greeting from the contract you just deployed."

**Claude**: *Uses the `read_contract` tool to read the stored message*

## Available Tools

- `post_message` - Post messages to blockchain
- `read_contract` - Read data from smart contracts  
- `write_contract` - Write data to smart contracts
- `deploy_contract` - Deploy new smart contracts

## Troubleshooting

### "Tool not found" errors
- Make sure Claude Desktop is restarted after config changes
- Check that the Python path in config is correct
- Verify the script path is absolute and correct

### "MCP not installed" error
- Run `pip install model-context-protocol` in your environment
- Make sure you're using the same Python that Claude Desktop will use

### "Stability toolkit not found" error
- Make sure `stability_toolkit.py` is in the parent directory
- Check that the path resolution is working correctly

### Test the script manually
```bash
cd stability-mcp/
python3 stability_mcp.py
```

The script should start and wait for MCP messages via stdin.

## Why This Works

Unlike traditional servers, MCP scripts are:
- **Executed on-demand** by Claude Desktop
- **Communicate via stdin/stdout** (no web server needed)
- **Stateless** - each call is independent
- **Simple** - just a Python script that implements MCP protocol

This approach is much simpler than running a web server and perfectly suited for tools like blockchain interactions. 