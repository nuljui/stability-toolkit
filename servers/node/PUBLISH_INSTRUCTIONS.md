# 🚀 STBL-MCP NPM Publishing Instructions

## ✅ Current Status
Your package is **ready to publish** and will work exactly like taskmaster-ai!

## 📦 What You Have
- **Package**: `stbl-mcp@0.1.0`
- **Size**: 2.5 kB (super lightweight)
- **Tools**: 2 blockchain tools (`stbl_write`, `stbl_read`)
- **CLI Ready**: Users can run `npx stbl-mcp`

## 🔧 Pre-Publishing Steps (DONE ✅)
- ✅ Fixed import error (`CallToolResult` removed)
- ✅ Package configuration complete
- ✅ Working MCP server with stdio transport
- ✅ Proper shebang for CLI usage
- ✅ Clean package.json with correct bin setup

## 📋 Publishing Steps

### 1. Login to NPM
```bash
cd servers/node
npm login
```
Enter your npm credentials when prompted.

### 2. Verify Package Contents
```bash
npm pack --dry-run
```
Should show: `index.js`, `README.md`, `package.json` (3 files total)

### 3. Check Package Name Availability (Optional)
```bash
npm view stbl-mcp
```
If it returns "404", the name is available. If it shows package info, you'll need to change the name.

### 4. Publish to NPM
```bash
npm publish
```

## 🎉 After Publishing

### Users Can Install & Run:
```bash
# One-time usage (like taskmaster-ai)
npx stbl-mcp

# Or install globally
npm install -g stbl-mcp
stbl-mcp
```

### Integration in Cursor/Claude Desktop:
```json
{
  "mcpServers": {
    "stbl-mcp": {
      "command": "npx",
      "args": ["-y", "stbl-mcp"]
    }
  }
}
```

## 🔍 Testing After Publish
```bash
# Test the package works globally
npx stbl-mcp@latest

# Test in a new directory
mkdir test-stbl && cd test-stbl
npx stbl-mcp
```

## 🚨 Troubleshooting

### If Package Name Taken:
Change `name` in `package.json` to something like:
- `stbl-mcp-server`
- `stability-mcp`
- `@yourusername/stbl-mcp`

### If Authentication Fails:
```bash
npm logout
npm login
```

### If Permission Issues:
```bash
npm publish --access public
```

## 🎯 Success Indicators
- ✅ `npm publish` completes without errors
- ✅ Package appears at `https://www.npmjs.com/package/stbl-mcp`
- ✅ `npx stbl-mcp` works from any directory
- ✅ Users can add to Cursor with simple npx command

## 📈 Next Steps After Publishing
1. Update project README with npm installation instructions
2. Add package to MCP registry/marketplace
3. Share with community
4. Monitor downloads and usage

---

**Your goal achieved!** 🚀 
Once published, users get the same experience as taskmaster-ai: `npx stbl-mcp` and they're ready to use Stability blockchain tools! 