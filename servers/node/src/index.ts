#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerStabilityTools } from './tools.js';

// Get API key from environment variable or use default
const API_KEY = process.env.STABILITY_API_KEY || 'try-it-out';

async function main() {
  // Create the MCP server
  const server = new Server(
    {
      name: 'stbl-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Register all the Stability tools
  registerStabilityTools(server, API_KEY);

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🚀 STBL-MCP Server running via stdio');
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 