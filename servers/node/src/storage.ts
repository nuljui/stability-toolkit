import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface StblConfig {
  apiKey: string;
  userAddress?: string;
  setupComplete: boolean;
  created: number;
  lastUpdated: number;
}

export interface ContractDeployment {
  address: string;
  abi: any[];
  constructorArgs: any[];
  deploymentHash: string;
  deployedAt: number;
  deployer: string;
  name?: string;
  source?: string;
}

export interface TransactionRecord {
  hash: string;
  type: 'message' | 'deploy' | 'call';
  timestamp: number;
  from?: string;
  to?: string;
  method?: string;
  args?: any[];
  gasUsed?: number;
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  details?: any;
}

export interface AddressInfo {
  address: string;
  name?: string;
  type: 'user' | 'contract' | 'external';
  firstSeen: number;
  lastActivity?: number;
  notes?: string;
}

export class StorageManager {
  private baseDir: string;
  private configPath: string;
  private contractsDir: string;
  private contractsRegistryPath: string;
  private transactionsDir: string;
  private transactionHistoryPath: string;
  private addressesDir: string;
  private addressBookPath: string;

  constructor() {
    this.baseDir = join(homedir(), '.stbl-mcp');
    this.configPath = join(this.baseDir, 'config.json');
    this.contractsDir = join(this.baseDir, 'contracts');
    this.contractsRegistryPath = join(this.contractsDir, 'deployed.json');
    this.transactionsDir = join(this.baseDir, 'transactions');
    this.transactionHistoryPath = join(this.transactionsDir, 'history.json');
    this.addressesDir = join(this.baseDir, 'addresses');
    this.addressBookPath = join(this.addressesDir, 'known.json');
  }

  async initialize(): Promise<void> {
    // Create directory structure
    await this.ensureDirectoryExists(this.baseDir);
    await this.ensureDirectoryExists(this.contractsDir);
    await this.ensureDirectoryExists(join(this.contractsDir, 'artifacts'));
    await this.ensureDirectoryExists(this.transactionsDir);
    await this.ensureDirectoryExists(this.addressesDir);

    // Initialize files if they don't exist
    await this.ensureFileExists(this.configPath, this.getDefaultConfig());
    await this.ensureFileExists(this.contractsRegistryPath, []);
    await this.ensureFileExists(this.transactionHistoryPath, []);
    await this.ensureFileExists(this.addressBookPath, []);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  private async ensureFileExists(filePath: string, defaultContent: any): Promise<void> {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  }

  private getDefaultConfig(): StblConfig {
    return {
      apiKey: 'try-it-out',
      setupComplete: false,
      created: Date.now(),
      lastUpdated: Date.now()
    };
  }

  // Config Management
  async getConfig(): Promise<StblConfig> {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // Return default if file doesn't exist or is corrupted
      const defaultConfig = this.getDefaultConfig();
      await this.saveConfig(defaultConfig);
      return defaultConfig;
    }
  }

  async saveConfig(config: StblConfig): Promise<void> {
    config.lastUpdated = Date.now();
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
  }

  async updateConfig(updates: Partial<StblConfig>): Promise<StblConfig> {
    const config = await this.getConfig();
    const updatedConfig = { ...config, ...updates };
    await this.saveConfig(updatedConfig);
    return updatedConfig;
  }

  // Contract Management
  async getDeployedContracts(): Promise<ContractDeployment[]> {
    try {
      const content = await fs.readFile(this.contractsRegistryPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async addDeployedContract(contract: ContractDeployment): Promise<void> {
    const contracts = await this.getDeployedContracts();
    
    // Remove any existing contract with the same address
    const filtered = contracts.filter(c => c.address !== contract.address);
    filtered.push(contract);
    
    await fs.writeFile(this.contractsRegistryPath, JSON.stringify(filtered, null, 2));

    // Save individual contract artifact
    const artifactPath = join(this.contractsDir, 'artifacts', `${contract.address}.json`);
    await fs.writeFile(artifactPath, JSON.stringify(contract, null, 2));
  }

  async getContractInfo(address: string): Promise<ContractDeployment | null> {
    const contracts = await this.getDeployedContracts();
    return contracts.find(c => c.address.toLowerCase() === address.toLowerCase()) || null;
  }

  // Transaction Management
  async getTransactionHistory(): Promise<TransactionRecord[]> {
    try {
      const content = await fs.readFile(this.transactionHistoryPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async addTransaction(transaction: TransactionRecord): Promise<void> {
    const history = await this.getTransactionHistory();
    
    // Remove any existing transaction with the same hash
    const filtered = history.filter(tx => tx.hash !== transaction.hash);
    filtered.unshift(transaction); // Add to beginning
    
    // Keep only last 1000 transactions
    const trimmed = filtered.slice(0, 1000);
    
    await fs.writeFile(this.transactionHistoryPath, JSON.stringify(trimmed, null, 2));
  }

  async updateTransaction(hash: string, updates: Partial<TransactionRecord>): Promise<void> {
    const history = await this.getTransactionHistory();
    const index = history.findIndex(tx => tx.hash === hash);
    
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      await fs.writeFile(this.transactionHistoryPath, JSON.stringify(history, null, 2));
    }
  }

  // Address Management
  async getAddressBook(): Promise<AddressInfo[]> {
    try {
      const content = await fs.readFile(this.addressBookPath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async addAddress(addressInfo: AddressInfo): Promise<void> {
    const addresses = await this.getAddressBook();
    
    // Remove any existing address entry
    const filtered = addresses.filter(a => a.address.toLowerCase() !== addressInfo.address.toLowerCase());
    filtered.push(addressInfo);
    
    await fs.writeFile(this.addressBookPath, JSON.stringify(filtered, null, 2));
  }

  async getAddressInfo(address: string): Promise<AddressInfo | null> {
    const addresses = await this.getAddressBook();
    return addresses.find(a => a.address.toLowerCase() === address.toLowerCase()) || null;
  }

  // Utility Methods
  async getSetupStatus(): Promise<{
    initialized: boolean;
    hasApiKey: boolean;
    hasUserAddress: boolean;
    contractCount: number;
    transactionCount: number;
    addressCount: number;
    warnings: string[];
  }> {
    const config = await this.getConfig();
    const contracts = await this.getDeployedContracts();
    const transactions = await this.getTransactionHistory();
    const addresses = await this.getAddressBook();

    const warnings: string[] = [];
    
    if (config.apiKey === 'try-it-out') {
      warnings.push('Using limited "try-it-out" API key. Get a FREE production key at https://portal.stabilityprotocol.com/');
    }
    
    if (!config.userAddress) {
      warnings.push('User address not discovered. Run discover_address tool to find your address automatically.');
    }

    return {
      initialized: true, // If we can read config, we're initialized
      hasApiKey: !!config.apiKey && config.apiKey !== '',
      hasUserAddress: !!config.userAddress,
      contractCount: contracts.length,
      transactionCount: transactions.length,
      addressCount: addresses.length,
      warnings
    };
  }

  async exportData(): Promise<{
    config: StblConfig;
    contracts: ContractDeployment[];
    transactions: TransactionRecord[];
    addresses: AddressInfo[];
  }> {
    return {
      config: await this.getConfig(),
      contracts: await this.getDeployedContracts(),
      transactions: await this.getTransactionHistory(),
      addresses: await this.getAddressBook()
    };
  }

  // Cleanup old data
  async cleanup(options: {
    olderThanDays?: number;
    keepTransactions?: number;
  } = {}): Promise<{
    deletedTransactions: number;
    deletedAddresses: number;
  }> {
    const { olderThanDays = 30, keepTransactions = 100 } = options;
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

    // Clean old transactions
    const transactions = await this.getTransactionHistory();
    const recentTransactions = transactions
      .filter(tx => tx.timestamp > cutoffTime || transactions.indexOf(tx) < keepTransactions)
      .slice(0, keepTransactions);
    
    await fs.writeFile(this.transactionHistoryPath, JSON.stringify(recentTransactions, null, 2));

    // Clean old address entries (keep if they have recent activity)
    const addresses = await this.getAddressBook();
    const activeAddresses = addresses.filter(addr => 
      !addr.lastActivity || addr.lastActivity > cutoffTime
    );
    
    await fs.writeFile(this.addressBookPath, JSON.stringify(activeAddresses, null, 2));

    return {
      deletedTransactions: transactions.length - recentTransactions.length,
      deletedAddresses: addresses.length - activeAddresses.length
    };
  }
}

// Global storage instance
export const storage = new StorageManager(); 