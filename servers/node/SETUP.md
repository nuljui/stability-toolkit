# STBL-MCP Setup - For Cursor Users

## ⚠️ IMPORTANT: You do NOT need to download anything manually!

**Don't clone repos, don't run Node commands, don't install anything globally.**

## Simple 3-Step Setup

### Step 1: Create Config File
In your project folder, create: `.cursor/mcp.json`

### Step 2: Copy This Config
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
Close Cursor completely → Wait 5 seconds → Reopen

## ✅ Test It Works
Ask Cursor: "What MCP tools are available?"
You should see 11 STBL-MCP tools.

## 🚫 Common Mistakes (DON'T DO THESE)

❌ Don't run: `git clone ...`  
❌ Don't run: `node index.js`  
❌ Don't run: `npm install` anything  
❌ Don't download the source code  
❌ Don't try to "build" or "setup" anything manually  

## 🔧 If "0 tools enabled"

1. **Check file location**: `.cursor/mcp.json` must be in your PROJECT folder
2. **Test the package**: `npx stbl-mcp@0.3.8` (should start the server)
3. **Check Node.js**: `node --version` (need 18+)
4. **Restart Cursor completely**

## 💡 How It Works

When you restart Cursor, it:
1. Reads your `.cursor/mcp.json`
2. Automatically downloads `stbl-mcp` from NPM  
3. Starts the server in the background
4. Makes the tools available to your AI

**You don't need to do anything else!**

---

**Still having issues?** Make sure you're NOT trying to run any commands manually. The MCP system handles everything automatically. 