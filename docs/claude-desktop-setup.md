# Using Stability MCP with Claude Desktop

This guide shows how to set up the Stability MCP server with Claude Desktop.

## Prerequisites

1. **Claude Desktop** - Download from [Claude.ai](https://claude.ai/download)
2. **Stability API Key** - Get free key from [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com)
3. **Python 3.8+** or **Docker**

## Setup Options

### Option 1: Using Python (Recommended for Development)

1. **Install dependencies:**
   ```bash
   cd servers/
   pip install -r requirements.txt
   ```

2. **Set your API key:**
   ```bash
   export STABILITY_API_KEY="your-api-key-here"
   ```

3. **Add to Claude Desktop config:**
   
   Open Claude Desktop settings and add to your MCP servers configuration:
   
   ```json
   {
     "mcpServers": {
       "stability": {
         "command": "python3",
         "args": ["/path/to/stability-mcp/servers/stability_mcp_server.py"],
         "env": {
           "STABILITY_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

### Option 2: Using Docker (Recommended for Production)

1. **Build the Docker image:**
   ```bash
   cd servers/
   docker build -t stbl/mcp-server .
   ```

2. **Add to Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "stability": {
         "command": "docker",
         "args": ["run", "-i", "--rm", "-e", "STABILITY_API_KEY=your-api-key-here", "stbl/mcp-server"]
       }
     }
   }
   ```

## Testing the Setup

1. **Restart Claude Desktop** after updating the configuration

2. **Test the tools** by asking Claude:
   - "Post a message to the Stability blockchain saying 'Hello from Claude!'"
   - "Deploy a simple storage contract to Stability"
   - "Read from a contract at address 0x..."

## Available Tools

When properly configured, Claude will have access to these Stability tools:

- **post_message** - Post messages to the blockchain
- **read_contract** - Read data from smart contracts
- **write_contract** - Write data to smart contracts
- **deploy_contract** - Deploy new smart contracts

## Example Usage

Ask Claude:

> "Use the Stability tools to deploy a simple contract that stores a greeting message, then read the message back."

Claude will:
1. Use `deploy_contract` to deploy a Solidity contract
2. Use `read_contract` to read the stored message
3. Provide you with the results

## Troubleshooting

### Common Issues

1. **"Tool not found" errors**
   - Make sure Claude Desktop is restarted after config changes
   - Check that the server path is correct
   - Verify API key is set

2. **Connection errors**
   - Ensure Python dependencies are installed
   - Check that stability_toolkit.py is in the parent directory
   - Verify the server can start manually

3. **"try-it-out" warnings**
   - This is normal if no API key is set
   - Get a free API key for full functionality

### Manual Testing

Test the server manually:

```bash
cd servers/
python3 stability_mcp_server.py
```

The server should start and show:
```
INFO:__main__:🚀 Starting Stability MCP Server
```

## Configuration File Location

The Claude Desktop configuration file is typically located at:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Next Steps

Once set up, you can:
- Deploy smart contracts through natural language
- Read blockchain data conversationally
- Integrate blockchain operations into AI workflows
- Build on the Stability protocol without gas fees

For more advanced usage, see the [SDK documentation](../sdk/README.md) or explore the [examples](../examples/). 