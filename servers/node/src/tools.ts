import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import {
  postZktV1,
  callContractRead,
  callContractWrite,
  deployContract,
  DEFAULT_API_KEY,
  ContractCall,
  ContractWrite,
  DeployContract
} from './api.js';


export function registerStabilityTools(server: Server, apiKey: string = DEFAULT_API_KEY) {
  // Existing blockchain tools
  server.registerTool(
    'stbl_write',
    {
      title: 'Post ZKTv1 message',
      description: 'Send a message to the Stability blockchain',
      inputSchema: { arguments: z.string() }
    },
    async ({ arguments: message }: { arguments: string }) => ({
      content: [{ type: 'text', text: await postZktV1(message, apiKey) }]
    })
  );

  server.registerTool(
    'stbl_read',
    {
      title: 'Read from contract',
      description: 'Execute a read-only contract call',
      inputSchema: {
        to: z.string(),
        abi: z.array(z.any()),
        method: z.string(),
        arguments: z.array(z.any()),
        id: z.number().optional()
      }
    },
    async (args: ContractCall) => ({
      content: [{ type: 'text', text: await callContractRead(args, apiKey) }]
    })
  );

  server.registerTool(
    'stbl_write_contract',
    {
      title: 'Write contract',
      description: 'Execute a state-changing contract call',
      inputSchema: {
        to: z.string(),
        abi: z.array(z.any()),
        method: z.string(),
        arguments: z.array(z.any()),
        wait: z.boolean().optional(),
        id: z.number().optional()
      }
    },
    async (args: ContractWrite) => ({
      content: [{ type: 'text', text: await callContractWrite(args, apiKey) }]
    })
  );

  server.registerTool(
    'stbl_deploy',
    {
      title: 'Deploy contract',
      description: 'Deploy a Solidity contract',
      inputSchema: {
        code: z.string(),
        arguments: z.array(z.any()).optional(),
        wait: z.boolean().optional(),
        id: z.number().optional()
      }
    },
    async (args: DeployContract) => ({
      content: [{ type: 'text', text: await deployContract(args, apiKey) }]
    })
  );


} 