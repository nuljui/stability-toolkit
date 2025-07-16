#!/usr/bin/env python3
"""
Stability MCP Script

A simple MCP script that provides Stability blockchain tools to AI agents.
Can be executed directly by MCP clients like Claude Desktop.
"""

import asyncio
import sys
import os
import logging
from typing import Any, Dict

# Add parent directory to path to import existing toolkit
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import (
        Tool, 
        TextContent, 
        CallToolResult,
        ListToolsResult,
    )
except ImportError:
    print("❌ MCP not installed. Run: pip install model-context-protocol")
    sys.exit(1)

# Import the existing stability toolkit
try:
    from stability_toolkit import StabilityToolkit
except ImportError:
    print("❌ Stability toolkit not found. Make sure stability_toolkit.py is in parent directory")
    sys.exit(1)

# Configure logging to stderr so it doesn't interfere with MCP stdio
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

# Initialize the MCP server
app = Server("stability-mcp")

# Create the toolkit instance
toolkit = StabilityToolkit()
stability_tools = toolkit.get_tools()

@app.list_tools()
async def list_tools() -> ListToolsResult:
    """List available Stability tools."""
    return ListToolsResult(
        tools=[
            Tool(
                name="post_message",
                description="Post a message to the Stability blockchain",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "The message to post to the blockchain"
                        }
                    },
                    "required": ["message"]
                }
            ),
            Tool(
                name="read_contract",
                description="Read data from a smart contract on Stability blockchain",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "contract_address": {
                            "type": "string",
                            "description": "The contract address to read from"
                        },
                        "method_name": {
                            "type": "string",
                            "description": "The method name to call"
                        },
                        "abi": {
                            "type": "string",
                            "description": "Contract ABI (optional - will use default if not provided)"
                        }
                    },
                    "required": ["contract_address", "method_name"]
                }
            ),
            Tool(
                name="write_contract",
                description="Write data to a smart contract on Stability blockchain",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "contract_address": {
                            "type": "string",
                            "description": "The contract address to write to"
                        },
                        "method_name": {
                            "type": "string",
                            "description": "The method name to call"
                        },
                        "method_args": {
                            "type": "string",
                            "description": "Arguments for the method call"
                        },
                        "abi": {
                            "type": "string",
                            "description": "Contract ABI (optional - will use default if not provided)"
                        }
                    },
                    "required": ["contract_address", "method_name", "method_args"]
                }
            ),
            Tool(
                name="deploy_contract",
                description="Deploy a new smart contract to Stability blockchain",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "solidity_code": {
                            "type": "string",
                            "description": "The Solidity contract code to deploy"
                        },
                        "constructor_args": {
                            "type": "string",
                            "description": "Constructor arguments (optional)"
                        }
                    },
                    "required": ["solidity_code"]
                }
            )
        ]
    )

@app.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult:
    """Handle tool calls from MCP clients."""
    logger.info(f"Tool called: {name} with arguments: {arguments}")
    
    try:
        if name == "post_message":
            return await handle_post_message(arguments)
        elif name == "read_contract":
            return await handle_read_contract(arguments)
        elif name == "write_contract":
            return await handle_write_contract(arguments)
        elif name == "deploy_contract":
            return await handle_deploy_contract(arguments)
        else:
            return CallToolResult(
                content=[TextContent(
                    type="text",
                    text=f"❌ Unknown tool: {name}"
                )]
            )
    except Exception as e:
        logger.error(f"Error in tool {name}: {str(e)}")
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"❌ Error: {str(e)}"
            )]
        )

async def handle_post_message(args: Dict[str, Any]) -> CallToolResult:
    """Handle posting a message to the blockchain."""
    message = args.get("message")
    if not message:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: 'message' is required"
            )]
        )
    
    # Find the write tool (first one should be StabilityWriteTool)
    write_tool = stability_tools[0]
    
    try:
        result = write_tool.invoke({"message": message})
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"✅ Message posted successfully!\n\n{result}"
            )]
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"❌ Failed to post message: {str(e)}"
            )]
        )

async def handle_read_contract(args: Dict[str, Any]) -> CallToolResult:
    """Handle reading from a contract."""
    contract_address = args.get("contract_address")
    method_name = args.get("method_name")
    abi = args.get("abi", "")
    
    if not contract_address or not method_name:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: 'contract_address' and 'method_name' are required"
            )]
        )
    
    # Find the read tool
    read_tool = None
    for tool in stability_tools:
        if "read" in tool.name.lower():
            read_tool = tool
            break
    
    if not read_tool:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: Read tool not found"
            )]
        )
    
    try:
        result = read_tool.invoke({
            "contract_address": contract_address,
            "method_name": method_name,
            "abi": abi
        })
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"✅ Contract read successful!\n\n{result}"
            )]
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"❌ Failed to read contract: {str(e)}"
            )]
        )

async def handle_write_contract(args: Dict[str, Any]) -> CallToolResult:
    """Handle writing to a contract."""
    contract_address = args.get("contract_address")
    method_name = args.get("method_name")
    method_args = args.get("method_args", "")
    abi = args.get("abi", "")
    
    if not contract_address or not method_name or not method_args:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: 'contract_address', 'method_name', and 'method_args' are required"
            )]
        )
    
    # Find the write contract tool
    write_tool = None
    for tool in stability_tools:
        if "write" in tool.name.lower() and "contract" in tool.name.lower():
            write_tool = tool
            break
    
    if not write_tool:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: Write contract tool not found"
            )]
        )
    
    try:
        result = write_tool.invoke({
            "contract_address": contract_address,
            "method_name": method_name,
            "method_args": method_args,
            "abi": abi
        })
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"✅ Contract write successful!\n\n{result}"
            )]
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"❌ Failed to write to contract: {str(e)}"
            )]
        )

async def handle_deploy_contract(args: Dict[str, Any]) -> CallToolResult:
    """Handle deploying a contract."""
    solidity_code = args.get("solidity_code")
    constructor_args = args.get("constructor_args", "")
    
    if not solidity_code:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: 'solidity_code' is required"
            )]
        )
    
    # Find the deploy tool
    deploy_tool = None
    for tool in stability_tools:
        if "deploy" in tool.name.lower():
            deploy_tool = tool
            break
    
    if not deploy_tool:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text="❌ Error: Deploy tool not found"
            )]
        )
    
    try:
        result = deploy_tool.invoke({
            "solidity_code": solidity_code,
            "constructor_args": constructor_args
        })
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"✅ Contract deployed successfully!\n\n{result}"
            )]
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=f"❌ Failed to deploy contract: {str(e)}"
            )]
        )

async def main():
    """Main entry point for the MCP server."""
    # Check for API key
    api_key = os.getenv("STABILITY_API_KEY")
    if not api_key:
        logger.warning("⚠️ No STABILITY_API_KEY found, using 'try-it-out' (limited functionality)")
    else:
        logger.info(f"✅ Using API key: {api_key[:8]}...")
    
    logger.info("🚀 Starting Stability MCP script")
    
    # Run the server with stdio transport
    async with stdio_server() as streams:
        await app.run(
            streams[0], 
            streams[1], 
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main()) 