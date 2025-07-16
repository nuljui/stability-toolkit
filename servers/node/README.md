# STBL-MCP Server

**Stability blockchain tools for AI agents** - Complete blockchain development toolkit with automatic tracking, zero gas fees, and AI-first design.

## ⚠️ For Users: You do NOT need to clone this repo!

**This is a published NPM package. Just add the MCP configuration below - no manual installation needed.**

## 🚀 Quick Setup for Cursor (3 Steps)

### Step 1: Create the Configuration File

In your **project folder**, create this file: `.cursor/mcp.json`

**If the `.cursor` folder doesn't exist, create it first.**

### Step 2: Add This Exact Configuration

Copy and paste this **exact code** into your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "npx",
      "args": ["-y", "stbl-mcp@0.3.8"],
      "env": {
        "STABILITY_API_KEY": "try-it-out"
      }
    }
  }
}
```

### Step 3: Restart Cursor

1. **Close Cursor completely** (not just the window - quit the application)
2. **Wait 5 seconds**
3. **Reopen Cursor**

### ✅ Test It Works

Ask Cursor: **"What MCP tools do you have available?"**

You should see **11 STBL-MCP tools** listed.

## 🔧 If It's Not Working

### Problem: "0 tools enabled" or no STBL tools

**Solution 1: Check your file location**
- Make sure `.cursor/mcp.json` is in your **project root folder**
- NOT in your home directory, NOT in a random folder

**Solution 2: Check Node.js version**
```bash
node --version
```
Must be **18.0.0 or higher**. If not, update Node.js.

**Solution 3: Test the package directly**
```bash
npx stbl-mcp@0.3.8
```
Should show: `🚀 STBL-MCP Server running via stdio`
Press Ctrl+C to stop.

**Solution 4: Check JSON syntax**
Copy the config again - make sure no typos, commas, or quotes are missing.

**Solution 5: Complete restart**
1. Close Cursor completely  
2. Delete `.cursor/mcp.json`
3. Recreate the file with the exact config above
4. Restart Cursor

### Problem: Tools appear but get errors

**Get your free API key:**
1. Go to [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com/)
2. Create account (free)
3. Generate API key  
4. Replace `"try-it-out"` with your actual key in the config
5. Restart Cursor

## 📖 First Steps After Setup

Once working, try these commands:

1. **"Initialize the STBL-MCP storage system"**
2. **"Discover my Stability blockchain address"**  
3. **"Post a message to the blockchain saying 'Hello World!'"**

## 📁 What Gets Created

STBL-MCP automatically creates: `~/.stbl-mcp/`
- Your blockchain data and transaction history
- All your deployed contracts  
- Your discovered address

## 🛠️ Complete Tool Suite (11 Tools)

### Core Blockchain Tools (4)
- **`stbl_write`** - Post messages to blockchain
- **`stbl_read`** - Read contract data
- **`stbl_write_contract`** - Execute contract functions
- **`stbl_deploy`** - Deploy smart contracts

### Setup & Management Tools (7)
- **`setup_init`** - Initialize storage
- **`setup_status`** - Show configuration status
- **`setup_api_key`** - Manage API key
- **`discover_address`** - Auto-discover your blockchain address
- **`contracts_deployed`** - List your deployed contracts
- **`contract_info`** - Get contract details
- **`tx_history`** - View transaction history

## ✨ Key Features

- **🆓 Zero gas fees** - Free blockchain interactions
- **🤖 Natural language** - Just talk to your AI
- **📊 Auto-tracking** - All contracts and transactions saved
- **🔍 Smart setup** - Automatic address discovery
- **⚡ Instant** - Real-time blockchain interaction

## 🔗 Links

- **Get API Key**: [portal.stabilityprotocol.com](https://portal.stabilityprotocol.com/)
- **Stability Protocol**: [stabilityprotocol.com](https://stabilityprotocol.com)

## 📄 License

MIT License - Free for commercial and personal use.

---

**Ready to build on Stability?** Follow the 3 steps above and start deploying smart contracts with zero gas fees! 🚀 