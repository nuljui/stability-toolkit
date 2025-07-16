import WebSocket from 'ws';
import { EventEmitter } from 'node:events';

export interface EventFilter {
  type?: string;
  contract?: string;
  event?: string;
  [key: string]: any;
}

export interface ChainEvent {
  type: string;
  contract?: string;
  event?: string;
  data?: any;
  timestamp?: number;
  blockNumber?: number;
  transactionHash?: string;
  [key: string]: any;
}

export interface EventSubscription {
  id: string;
  filter: EventFilter;
  active: boolean;
  createdAt: number;
  eventCount: number;
}

export class EventManager extends EventEmitter {
  private ws?: WebSocket;
  private queue: ChainEvent[] = [];
  private subscriptions: Map<string, EventSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private wsUrl: string = 'wss://events.stabilityprotocol.com/ws') {
    super();
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);
        
        this.ws.on('open', () => {
          console.log('✅ Connected to Stability event stream');
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve(true);
        });

        this.ws.on('message', (data) => {
          try {
            const evt = JSON.parse(data.toString()) as ChainEvent;
            evt.timestamp = evt.timestamp || Date.now();
            this.queue.push(evt);
            this.processEvent(evt);
          } catch (error) {
            console.error('Error parsing event:', error);
          }
        });

        this.ws.on('error', (err) => {
          console.error('WebSocket error:', err);
          this.emit('error', err);
          reject(err);
        });

        this.ws.on('close', () => {
          console.log('WebSocket connection closed');
          this.emit('disconnected');
          this.attemptReconnect();
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private processEvent(evt: ChainEvent) {
    // Process event against all active subscriptions
    for (const [subId, subscription] of this.subscriptions) {
      if (subscription.active && this.matchesFilter(evt, subscription.filter)) {
        subscription.eventCount++;
        this.emit('subscription_event', subId, evt);
      }
    }
    
    // Emit general event
    this.emit('event', evt);
  }

  private matchesFilter(evt: ChainEvent, filter: EventFilter): boolean {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return evt[key] === value;
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(err => {
          console.error('Reconnection failed:', err);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnects_reached');
    }
  }

  subscribe(filter: EventFilter): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      filter,
      active: true,
      createdAt: Date.now(),
      eventCount: 0
    };

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`✅ Created subscription ${subscriptionId} with filter:`, filter);
    
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);
      console.log(`✅ Unsubscribed from ${subscriptionId}`);
      return true;
    }
    return false;
  }

  getSubscription(subscriptionId: string): EventSubscription | undefined {
    return this.subscriptions.get(subscriptionId);
  }

  listSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  getRecentEvents(limit: number = 50): ChainEvent[] {
    return this.queue.slice(-limit);
  }

  queryEvents(filter: EventFilter, limit: number = 100): ChainEvent[] {
    return this.queue
      .filter(evt => this.matchesFilter(evt, filter))
      .slice(-limit);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
    
    // Deactivate all subscriptions
    for (const subscription of this.subscriptions.values()) {
      subscription.active = false;
    }
  }

  getStatus() {
    return {
      connected: this.ws?.readyState === WebSocket.OPEN,
      subscriptions: this.subscriptions.size,
      queueSize: this.queue.length,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Global event manager instance
export const eventManager = new EventManager(); 