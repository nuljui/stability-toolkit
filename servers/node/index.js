#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Get API key from environment variable or use default
const API_KEY = process.env.STABILITY_API_KEY || 'try-it-out';

// Lightweight storage functions for tracking
class TrackingStorage {
  constructor() {
    this.baseDir = join(homedir(), '.stbl-mcp');
    this.configPath = join(this.baseDir, 'config.json');
    this.contractsRegistryPath = join(this.baseDir, 'contracts', 'deployed.json');
    this.transactionHistoryPath = join(this.baseDir, 'transactions', 'history.json');
    this.addressBookPath = join(this.baseDir, 'addresses', 'known.json');
  }

  async ensureInitialized() {
    try {
      await fs.mkdir(join(this.baseDir, 'contracts'), { recursive: true });
      await fs.mkdir(join(this.baseDir, 'contracts', 'artifacts'), { recursive: true });
      await fs.mkdir(join(this.baseDir, 'transactions'), { recursive: true });
      await fs.mkdir(join(this.baseDir, 'addresses'), { recursive: true });

      // Initialize files if they don't exist
      const defaultConfig = {
        apiKey: 'try-it-out',
        setupComplete: false,
        created: Date.now(),
        lastUpdated: Date.now()
      };

      await this.ensureFileExists(this.configPath, defaultConfig);
      await this.ensureFileExists(this.contractsRegistryPath, []);
      await this.ensureFileExists(this.transactionHistoryPath, []);
      await this.ensureFileExists(this.addressBookPath, []);
    } catch (error) {
      console.error('Storage initialization failed:', error);
    }
  }

  async ensureFileExists(filePath, defaultContent) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  }

  async addTransaction(transaction) {
    try {
      const history = await this.getTransactionHistory();
      const filtered = history.filter(tx => tx.hash !== transaction.hash);
      filtered.unshift(transaction);
      const trimmed = filtered.slice(0, 1000);
      await fs.writeFile(this.transactionHistoryPath, JSON.stringify(trimmed, null, 2));
    } catch (error) {
      console.error('Failed to track transaction:', error);
    }
  }

  async addDeployedContract(contract) {
    try {
      const contracts = await this.getDeployedContracts();
      const filtered = contracts.filter(c => c.address !== contract.address);
      filtered.push(contract);
      await fs.writeFile(this.contractsRegistryPath, JSON.stringify(filtered, null, 2));

      // Save individual artifact
      const artifactPath = join(this.baseDir, 'contracts', 'artifacts', `${contract.address}.json`);
      await fs.writeFile(artifactPath, JSON.stringify(contract, null, 2));
    } catch (error) {
      console.error('Failed to track contract:', error);
    }
  }

  async getTransactionHistory() {
    try {
      const content = await fs.readFile(this.transactionHistoryPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async getDeployedContracts() {
    try {
      const content = await fs.readFile(this.contractsRegistryPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async getConfig() {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return {
        apiKey: 'try-it-out',
        setupComplete: false,
        created: Date.now(),
        lastUpdated: Date.now()
      };
    }
  }

  async updateConfig(updates) {
    try {
      const config = await this.getConfig();
      const updatedConfig = { ...config, ...updates, lastUpdated: Date.now() };
      await fs.writeFile(this.configPath, JSON.stringify(updatedConfig, null, 2));
      return updatedConfig;
    } catch (error) {
      console.error('Failed to update config:', error);
      return null;
    }
  }
}

const tracking = new TrackingStorage();

// Real API functions using Stability blockchain
async function postZktV1(message, apiKey = API_KEY) {
  const url = `https://rpc.stabilityprotocol.com/zkt/${apiKey}`;
  const payload = { arguments: message };
  
  // Warn about try-it-out key limitations
  if (apiKey === "try-it-out") {
    console.error("⚠️  Warning: Using 'try-it-out' API key (limited functionality)");
    console.error("   For production use, get a FREE API key at: https://portal.stabilityprotocol.com/");
    console.error("   Free tier: 1000 writes/month, 200 reads/minute, up to 3 keys");
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    // Try to parse as JSON, fallback to raw text
    try {
      return JSON.parse(responseText);
    } catch {
      return { success: true, raw_response: responseText };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: "Failed to connect to Stability blockchain"
    };
  }
}

async function callContractRead(args, apiKey = API_KEY) {
  const url = `https://rpc.stabilityprotocol.com/zkt/${apiKey}`;
  const payload = {
    to: args.to,
    abi: args.abi || [],
    method: args.method,
    arguments: args.arguments || [],
    id: args.id || 1
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    // Try to parse as JSON, fallback to raw text
    try {
      return JSON.parse(responseText);
    } catch {
      return { success: true, raw_response: responseText };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: "Failed to connect to Stability blockchain"
    };
  }
}

async function callContractWrite(args, apiKey = API_KEY) {
  const url = `https://rpc.stabilityprotocol.com/zkt/${apiKey}`;
  const payload = {
    to: args.to,
    abi: args.abi || [],
    method: args.method,
    arguments: args.arguments || [],
    wait: args.wait !== false,
    id: args.id || 1
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    try {
      return JSON.parse(responseText);
    } catch {
      return { success: true, raw_response: responseText };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: "Failed to execute contract transaction"
    };
  }
}

async function deployContract(args, apiKey = API_KEY) {
  const url = `https://rpc.stabilityprotocol.com/zkt/${apiKey}`;
  const payload = {
    code: args.code,
    arguments: args.arguments || [],
    wait: args.wait !== false,
    id: args.id || 1
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    try {
      return JSON.parse(responseText);
    } catch {
      return { success: true, raw_response: responseText };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: "Failed to deploy contract"
    };
  }
}



// Tool definitions
const TOOLS = [
  {
    name: 'stbl_write',
    description: 'Post ZKTv1 message to Stability blockchain with zero gas fees',
    inputSchema: {
      type: 'object',
      properties: {
        arguments: {
          type: 'string',
          description: 'Message to post to blockchain'
        }
      },
      required: ['arguments']
    }
  },
  {
    name: 'stbl_read',
    description: 'Execute read-only contract calls on Stability blockchain',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Contract address to call'
        },
        method: {
          type: 'string',
          description: 'Function name to call'
        },
        arguments: {
          type: 'array',
          description: 'Function arguments',
          items: { type: 'string' }
        },
        abi: {
          type: 'array',
          description: 'Contract ABI (Application Binary Interface)',
          items: { type: 'string' }
        },
        id: {
          type: 'number',
          description: 'Request ID for tracking',
          default: 1
        }
      },
      required: ['to', 'method']
    }
  },
  {
    name: 'stbl_write_contract',
    description: 'Execute state-changing smart contract calls on Stability blockchain',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Contract address to call'
        },
        method: {
          type: 'string',
          description: 'Function name to call'
        },
        arguments: {
          type: 'array',
          description: 'Function arguments',
          items: { type: 'string' }
        },
        abi: {
          type: 'array',
          description: 'Contract ABI (Application Binary Interface)',
          items: { type: 'string' }
        },
        wait: {
          type: 'boolean',
          description: 'Wait for transaction confirmation',
          default: true
        },
        id: {
          type: 'number',
          description: 'Request ID for tracking',
          default: 1
        }
      },
      required: ['to', 'method']
    }
  },
  {
    name: 'stbl_deploy',
    description: 'Deploy a Solidity smart contract to Stability blockchain',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Solidity contract source code'
        },
        arguments: {
          type: 'array',
          description: 'Constructor arguments',
          items: { type: 'string' }
        },
        wait: {
          type: 'boolean',
          description: 'Wait for deployment confirmation',
          default: false
        },
        id: {
          type: 'number',
          description: 'Request ID for tracking',
          default: 1
        }
      },
      required: ['code']
    }
  },
  {
    name: 'setup_init',
    description: 'Initialize STBL-MCP storage and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'setup_status',
    description: 'Get current setup and configuration status',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'discover_address',
    description: 'Automatically discover user address via contract deployment',
    inputSchema: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          description: 'Force rediscovery even if address already exists',
          default: false
        }
      },
      required: []
    }
  },
  {
    name: 'setup_api_key',
    description: 'Set or update API key configuration',
    inputSchema: {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          description: 'Stability API key (get free key at https://portal.stabilityprotocol.com/)'
        }
      },
      required: ['apiKey']
    }
  },
  {
    name: 'contracts_deployed',
    description: 'List all deployed contracts with their ABIs and deployment info',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of contracts to return',
          default: 50
        }
      },
      required: []
    }
  },
  {
    name: 'contract_info',
    description: 'Get detailed information about a specific deployed contract',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Contract address to get info for'
        }
      },
      required: ['address']
    }
  },
  {
    name: 'tx_history',
    description: 'View transaction history with filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of transactions to return',
          default: 20
        },
        type: {
          type: 'string',
          description: 'Filter by transaction type (message, deploy, call)',
          enum: ['message', 'deploy', 'call']
        },
        address: {
          type: 'string',
          description: 'Filter by contract address'
        }
      },
      required: []
    }
  }
];

async function main() {
  // Initialize tracking storage
  await tracking.ensureInitialized();
  
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

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS
    };
  });

  // Handle call tool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'stbl_write':
          const writeResult = await postZktV1(args.arguments, API_KEY);
          
          // Track successful message posting
          if (writeResult.success && writeResult.hash) {
            await tracking.addTransaction({
              hash: writeResult.hash,
              type: 'message',
              timestamp: Date.now(),
              method: 'stbl_write',
              args: [args.arguments],
              status: 'success',
              details: {
                message: args.arguments
              }
            });
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(writeResult, null, 2)
            }]
          };

        case 'stbl_read':
          const readResult = await callContractRead(args, API_KEY);
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(readResult, null, 2)
            }]
          };

        case 'stbl_write_contract':
          const writeContractResult = await callContractWrite(args, API_KEY);
          
          // Track successful contract write
          if (writeContractResult.success && writeContractResult.hash) {
            await tracking.addTransaction({
              hash: writeContractResult.hash,
              type: 'call',
              timestamp: Date.now(),
              to: args.to,
              method: args.method,
              args: args.arguments || [],
              status: 'success',
              details: {
                contractAddress: args.to,
                functionName: args.method
              }
            });
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(writeContractResult, null, 2)
            }]
          };

        case 'stbl_deploy':
          const deployResult = await deployContract(args, API_KEY);
          
          // Track successful contract deployment
          if (deployResult.success && deployResult.contractAddress && deployResult.hash) {
            // Get current user address from config
            const config = await tracking.getConfig();
            
            // Add to deployed contracts registry
            await tracking.addDeployedContract({
              address: deployResult.contractAddress,
              abi: deployResult.abi || [],
              constructorArgs: args.arguments || [],
              deploymentHash: deployResult.hash,
              deployedAt: Date.now(),
              deployer: config.userAddress || 'unknown',
              source: args.code || ''
            });

            // Track deployment transaction
            await tracking.addTransaction({
              hash: deployResult.hash,
              type: 'deploy',
              timestamp: Date.now(),
              from: config.userAddress,
              to: deployResult.contractAddress,
              method: 'constructor',
              args: args.arguments || [],
              status: 'success',
              details: {
                contractAddress: deployResult.contractAddress,
                constructorArgs: args.arguments || []
              }
            });
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(deployResult, null, 2)
            }]
          };


        case 'setup_init':
          await tracking.ensureInitialized();
          const initResult = {
            success: true,
            message: '✅ STBL-MCP storage initialized successfully',
            storagePath: tracking.baseDir,
            directories: [
              'contracts/',
              'contracts/artifacts/',
              'transactions/',
              'addresses/'
            ],
            files: [
              'config.json',
              'contracts/deployed.json',
              'transactions/history.json',
              'addresses/known.json'
            ],
            timestamp: Date.now()
          };
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(initResult, null, 2)
            }]
          };

        case 'setup_status':
          const config = await tracking.getConfig();
          const contracts = await tracking.getDeployedContracts();
          const transactions = await tracking.getTransactionHistory();
          
          const warnings = [];
          if (config.apiKey === 'try-it-out') {
            warnings.push('Using limited "try-it-out" API key. Get a FREE production key at https://portal.stabilityprotocol.com/');
          }
          if (!config.userAddress) {
            warnings.push('User address not discovered. Run discover_address tool to find your address automatically.');
          }

          const statusResult = {
            initialized: true,
            configuration: {
              apiKey: config.apiKey === 'try-it-out' ? 'try-it-out (limited)' : '***configured***',
              userAddress: config.userAddress || 'not discovered',
              setupComplete: config.setupComplete
            },
            statistics: {
              contractsDeployed: contracts.length,
              transactionsRecorded: transactions.length,
              storageLocation: tracking.baseDir
            },
            warnings,
            recommendations: warnings.length > 0 ? [
              'Run setup_api_key to set production API key',
              'Run discover_address to find your address automatically'
            ] : ['Setup is complete! ✅']
          };
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(statusResult, null, 2)
            }]
          };

        case 'discover_address':
          const currentConfig = await tracking.getConfig();
          
          if (currentConfig.userAddress && !args.force) {
            return {
              content: [{ 
                type: 'text', 
                text: JSON.stringify({
                  success: false,
                  error: 'Address already discovered',
                  currentAddress: currentConfig.userAddress,
                  message: 'Use force: true to rediscover address'
                }, null, 2)
              }]
            };
          }

          try {
            // Deploy discovery contract
            const discoveryResult = await deployContract({
              code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressDiscovery {
    address public discoveredAddress;
    uint256 public timestamp;
    
    constructor() {
        discoveredAddress = msg.sender;
        timestamp = block.timestamp;
    }
    
    function getDiscoveredAddress() public view returns (address) {
        return discoveredAddress;
    }
}`,
              arguments: [],
              wait: true
            }, API_KEY);

            if (discoveryResult.success && discoveryResult.contractAddress) {
              // Read the discovered address
              const readResult = await callContractRead({
                to: discoveryResult.contractAddress,
                abi: ['function getDiscoveredAddress() public view returns (address)'],
                method: 'getDiscoveredAddress',
                arguments: []
              }, API_KEY);

              if (readResult.success && readResult.output) {
                const discoveredAddress = readResult.output;
                
                // Update config with discovered address
                await tracking.updateConfig({
                  userAddress: discoveredAddress,
                  setupComplete: true
                });

                return {
                  content: [{ 
                    type: 'text', 
                    text: JSON.stringify({
                      success: true,
                      address: discoveredAddress,
                      method: 'contract-deployment',
                      transactionHash: discoveryResult.hash,
                      contractAddress: discoveryResult.contractAddress,
                      message: `✅ Address discovered: ${discoveredAddress}`
                    }, null, 2)
                  }]
                };
              }
            }
            
            return {
              content: [{ 
                type: 'text', 
                text: JSON.stringify({
                  success: false,
                  error: 'Failed to discover address via contract deployment'
                }, null, 2)
              }]
            };
          } catch (error) {
            return {
              content: [{ 
                type: 'text', 
                text: JSON.stringify({
                  success: false,
                  error: `Address discovery failed: ${error.message}`
                }, null, 2)
              }]
            };
          }

        case 'setup_api_key':
          if (!args.apiKey || args.apiKey.trim() === '') {
            return {
              content: [{ 
                type: 'text', 
                text: JSON.stringify({
                  success: false,
                  error: 'API key cannot be empty'
                }, null, 2)
              }]
            };
          }

          const updatedConfig = await tracking.updateConfig({
            apiKey: args.apiKey.trim()
          });

          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify({
                success: true,
                message: '✅ API key updated successfully',
                previousKey: currentConfig.apiKey === 'try-it-out' ? 'try-it-out (default)' : '***previous***',
                newKey: args.apiKey === 'try-it-out' ? 'try-it-out (limited)' : '***configured***',
                note: 'API key changes will take effect on next tool usage'
              }, null, 2)
            }]
          };

        case 'contracts_deployed':
          const deployedContracts = await tracking.getDeployedContracts();
          const limit = args.limit || 50;
          const limitedContracts = deployedContracts.slice(0, limit);

          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify({
                success: true,
                totalContracts: deployedContracts.length,
                showing: limitedContracts.length,
                contracts: limitedContracts.map(contract => ({
                  address: contract.address,
                  deploymentHash: contract.deploymentHash,
                  deployedAt: new Date(contract.deployedAt).toISOString(),
                  deployer: contract.deployer,
                  name: contract.name || 'Unknown',
                  hasABI: contract.abi && contract.abi.length > 0,
                  functionCount: contract.abi ? contract.abi.filter(item => item.type === 'function').length : 0
                }))
              }, null, 2)
            }]
          };

        case 'contract_info':
          const contractAddress = args.address.toLowerCase();
          const allContracts = await tracking.getDeployedContracts();
          const contractInfo = allContracts.find(c => c.address.toLowerCase() === contractAddress);

          if (!contractInfo) {
            return {
              content: [{ 
                type: 'text', 
                text: JSON.stringify({
                  success: false,
                  error: `Contract not found: ${args.address}`,
                  suggestion: 'Use contracts_deployed to see all deployed contracts'
                }, null, 2)
              }]
            };
          }

          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify({
                success: true,
                contract: {
                  address: contractInfo.address,
                  deploymentHash: contractInfo.deploymentHash,
                  deployedAt: new Date(contractInfo.deployedAt).toISOString(),
                  deployer: contractInfo.deployer,
                  name: contractInfo.name || 'Unknown',
                  constructorArgs: contractInfo.constructorArgs,
                  abi: contractInfo.abi,
                  functions: contractInfo.abi ? contractInfo.abi.filter(item => item.type === 'function').map(fn => ({
                    name: fn.name,
                    inputs: fn.inputs,
                    outputs: fn.outputs,
                    stateMutability: fn.stateMutability
                  })) : [],
                  source: contractInfo.source ? contractInfo.source.substring(0, 500) + (contractInfo.source.length > 500 ? '...' : '') : null
                }
              }, null, 2)
            }]
          };

        case 'tx_history':
          const allTransactions = await tracking.getTransactionHistory();
          let filteredTransactions = allTransactions;

          // Apply filters
          if (args.type) {
            filteredTransactions = filteredTransactions.filter(tx => tx.type === args.type);
          }
          if (args.address) {
            const targetAddress = args.address.toLowerCase();
            filteredTransactions = filteredTransactions.filter(tx => 
              (tx.to && tx.to.toLowerCase() === targetAddress) ||
              (tx.from && tx.from.toLowerCase() === targetAddress) ||
              (tx.details?.contractAddress && tx.details.contractAddress.toLowerCase() === targetAddress)
            );
          }

          const txLimit = args.limit || 20;
          const limitedTransactions = filteredTransactions.slice(0, txLimit);

          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify({
                success: true,
                totalTransactions: allTransactions.length,
                filteredTransactions: filteredTransactions.length,
                showing: limitedTransactions.length,
                filters: {
                  type: args.type || 'all',
                  address: args.address || 'all'
                },
                transactions: limitedTransactions.map(tx => ({
                  hash: tx.hash,
                  type: tx.type,
                  timestamp: new Date(tx.timestamp).toISOString(),
                  from: tx.from,
                  to: tx.to,
                  method: tx.method,
                  status: tx.status,
                  summary: tx.type === 'message' ? `Message: ${tx.details?.message?.substring(0, 50) || 'N/A'}` :
                          tx.type === 'deploy' ? `Contract deployed: ${tx.to}` :
                          tx.type === 'call' ? `Called ${tx.method} on ${tx.to}` : 'Unknown'
                }))
              }, null, 2)
            }]
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [{ 
          type: 'text', 
          text: `❌ Error: ${error.message}`
        }],
        isError: true
      };
    }
  });

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