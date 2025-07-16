import { deployContract } from './api.js';
import { storage } from './storage.js';

export interface AddressDiscoveryResult {
  success: boolean;
  address?: string;
  method: string;
  transactionHash?: string;
  contractAddress?: string;
  error?: string;
  timestamp: number;
}

export class AddressDiscovery {
  private readonly DISCOVERY_CONTRACT = `
// SPDX-License-Identifier: MIT
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
    
    function getTimestamp() public view returns (uint256) {
        return timestamp;
    }
    
    function verify() public view returns (address, uint256) {
        return (discoveredAddress, timestamp);
    }
}`;

  async discoverAddress(apiKey: string): Promise<AddressDiscoveryResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Starting address discovery via contract deployment...');
      
      // Deploy the discovery contract
      const deployResult = await deployContract({
        contractName: 'AddressDiscovery',
        constructorArgs: []
      }, apiKey);

      // Parse the deployment result
      const result = typeof deployResult === 'string' ? JSON.parse(deployResult) : deployResult;
      
      if (!result.success) {
        return {
          success: false,
          method: 'contract-deployment',
          error: result.error || 'Deployment failed',
          timestamp: startTime
        };
      }

      if (!result.contractAddress) {
        return {
          success: false,
          method: 'contract-deployment',
          error: 'No contract address returned from deployment',
          timestamp: startTime
        };
      }

      console.log(`✅ Discovery contract deployed at: ${result.contractAddress}`);
      
      // The deployment should have the deployer address in the ABI call
      // Let's try to call the contract to get the discovered address
      const { callContractRead } = await import('./api.js');
      
      const readResult = await callContractRead({
        contractAddress: result.contractAddress,
        functionName: 'getDiscoveredAddress',
        args: []
      }, apiKey);

      // Parse the read result
      const readData = typeof readResult === 'string' ? JSON.parse(readResult) : readResult;
      
      if (!readData.success || !readData.output) {
        return {
          success: false,
          method: 'contract-deployment',
          error: 'Failed to read discovered address from contract',
          timestamp: startTime,
          transactionHash: result.hash,
          contractAddress: result.contractAddress
        };
      }

      const discoveredAddress = readData.output;
      
      // Validate the address format
      if (!this.isValidAddress(discoveredAddress)) {
        return {
          success: false,
          method: 'contract-deployment',
          error: `Invalid address format: ${discoveredAddress}`,
          timestamp: startTime,
          transactionHash: result.hash,
          contractAddress: result.contractAddress
        };
      }

      console.log(`🎉 Successfully discovered address: ${discoveredAddress}`);

      // Store the discovered address in config
      await storage.updateConfig({
        userAddress: discoveredAddress,
        setupComplete: true
      });

      // Add to address book
      await storage.addAddress({
        address: discoveredAddress,
        name: 'My Address (Auto-discovered)',
        type: 'user',
        firstSeen: startTime,
        lastActivity: startTime,
        notes: `Discovered via contract deployment at ${result.contractAddress}`
      });

      // Store the discovery contract info
      await storage.addDeployedContract({
        address: result.contractAddress,
        abi: result.abi || [],
        constructorArgs: [],
        deploymentHash: result.hash,
        deployedAt: startTime,
        deployer: discoveredAddress,
        name: 'AddressDiscovery',
        source: this.DISCOVERY_CONTRACT
      });

      // Record the discovery transaction
      await storage.addTransaction({
        hash: result.hash,
        type: 'deploy',
        timestamp: startTime,
        from: discoveredAddress,
        to: result.contractAddress,
        method: 'constructor',
        args: [],
        status: 'success',
        details: {
          purpose: 'Address Discovery',
          discoveredAddress
        }
      });

      return {
        success: true,
        address: discoveredAddress,
        method: 'contract-deployment',
        transactionHash: result.hash,
        contractAddress: result.contractAddress,
        timestamp: startTime
      };

    } catch (error) {
      console.error('❌ Address discovery failed:', error);
      return {
        success: false,
        method: 'contract-deployment',
        error: error instanceof Error ? error.message : String(error),
        timestamp: startTime
      };
    }
  }

  async getCurrentAddress(): Promise<string | null> {
    try {
      const config = await storage.getConfig();
      return config.userAddress || null;
    } catch {
      return null;
    }
  }

  async hasDiscoveredAddress(): Promise<boolean> {
    const address = await this.getCurrentAddress();
    return !!address;
  }

  async forceRediscovery(apiKey: string): Promise<AddressDiscoveryResult> {
    console.log('🔄 Forcing address rediscovery...');
    
    // Clear existing address
    await storage.updateConfig({
      userAddress: undefined,
      setupComplete: false
    });

    return await this.discoverAddress(apiKey);
  }

  private isValidAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  async getDiscoveryHistory(): Promise<{
    currentAddress?: string;
    discoveryAttempts: number;
    lastDiscovery?: number;
    discoveryContracts: string[];
  }> {
    const config = await storage.getConfig();
    const contracts = await storage.getDeployedContracts();
    const transactions = await storage.getTransactionHistory();

    const discoveryContracts = contracts
      .filter(c => c.name === 'AddressDiscovery')
      .map(c => c.address);

    const discoveryTransactions = transactions
      .filter(tx => tx.details?.purpose === 'Address Discovery');

    return {
      currentAddress: config.userAddress,
      discoveryAttempts: discoveryTransactions.length,
      lastDiscovery: discoveryTransactions[0]?.timestamp,
      discoveryContracts
    };
  }

  async validateCurrentAddress(apiKey: string): Promise<{
    isValid: boolean;
    error?: string;
    canTransact?: boolean;
  }> {
    const currentAddress = await this.getCurrentAddress();
    
    if (!currentAddress) {
      return {
        isValid: false,
        error: 'No address discovered yet'
      };
    }

    if (!this.isValidAddress(currentAddress)) {
      return {
        isValid: false,
        error: 'Invalid address format'
      };
    }

    // Try to make a simple test call to validate the address can be used
    try {
      const { callContractRead } = await import('./api.js');
      
      // Deploy a simple test contract to verify we can transact
      const testResult = await deployContract({
        contractName: 'AddressValidation',
        constructorArgs: []
      }, apiKey);

      const result = typeof testResult === 'string' ? JSON.parse(testResult) : testResult;
      
      if (result.success && result.contractAddress) {
        // Read back the validator address
        const readResult = await callContractRead({
          contractAddress: result.contractAddress,
          functionName: 'getValidator',
          args: []
        }, apiKey);

        const readData = typeof readResult === 'string' ? JSON.parse(readResult) : readResult;
        const validatorAddress = readData.output;

        if (validatorAddress && validatorAddress.toLowerCase() === currentAddress.toLowerCase()) {
          return {
            isValid: true,
            canTransact: true
          };
        } else {
          return {
            isValid: false,
            error: `Address mismatch: expected ${currentAddress}, got ${validatorAddress}`,
            canTransact: false
          };
        }
      } else {
        return {
          isValid: true, // Address format is valid, but can't verify transaction capability
          canTransact: false,
          error: 'Cannot verify transaction capability'
        };
      }

    } catch (error) {
      return {
        isValid: true, // Address format is valid
        canTransact: false,
        error: `Transaction test failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}

// Export singleton instance
export const addressDiscovery = new AddressDiscovery(); 