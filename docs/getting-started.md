# Getting Started with Stability MCP

This guide will help you get started with the Stability MCP implementation, covering both the Anthropic MCP standard and Agent-MCP framework approaches.

## Installation

1. **Clone or download the project:**
   ```bash
   cd stability-mcp-agent
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install the package:**
   ```bash
   pip install -e .
   ```

## Configuration

### API Key Setup

1. **Get your FREE API key:**
   - Visit [https://portal.stabilityprotocol.com/](https://portal.stabilityprotocol.com/)
   - Sign up for a free account
   - Generate your API key

2. **Set environment variable:**
   ```bash
   export STABILITY_API_KEY="your-api-key-here"
   ```

### Free Tier Limits
- **API Keys**: Up to 3 keys per account
- **Write Transactions**: 1,000 per month
- **Read Operations**: 200 per minute
- **Cost**: Completely FREE

## Choosing Your Approach

### Anthropic MCP (Recommended)

**Best for:**
- Integration with existing AI systems
- Industry-standard compliance
- Broad ecosystem compatibility
- Production deployments

**Key Benefits:**
- Supported by OpenAI, Google, Microsoft, Vercel, Cloudflare, Stripe
- 5,000+ community-contributed servers
- Official SDKs in multiple languages
- Described as "USB-C for AI"

### Agent-MCP Framework

**Best for:**
- Agent-to-agent communication
- Custom agent architectures
- Experimental implementations
- Multi-agent coordination

**Key Benefits:**
- Flexible agent design
- Direct peer-to-peer communication
- Custom task management
- Extensible architecture

## Quick Start Examples

### Anthropic MCP Example

```python
import asyncio
from anthropic_mcp.client.stability_mcp_client import StabilityMCPContext

async def main():
    async with StabilityMCPContext() as client:
        # Post a message
        result = await client.post_message("Hello, MCP!")
        print(f"Result: {result}")
        
        # Deploy a contract
        contract_code = '''
        pragma solidity ^0.8.0;
        contract HelloWorld {
            string public message = "Hello, World!";
        }
        '''
        
        deploy_result = await client.deploy_contract(contract_code)
        print(f"Deploy result: {deploy_result}")

asyncio.run(main())
```

### Agent-MCP Example

```python
import asyncio
from agent_mcp.agents.stability_agent import StabilityAgent, Task

async def main():
    agent = StabilityAgent()
    
    # Create a task
    task = Task(
        id="task_001",
        type="post_message",
        description="Post a message to blockchain",
        parameters={"message": "Hello from Agent-MCP!"}
    )
    
    # Process the task
    artifact = await agent.process_task(task)
    print(f"Result: {artifact}")

asyncio.run(main())
```

## Running the Examples

### Anthropic MCP Example
```bash
cd examples
python basic_anthropic_mcp.py
```

### Agent-MCP Example
```bash
cd examples
python basic_agent_mcp.py
```

## Available Tools

### Common Tools (Both Implementations)

1. **post_message** - Post a simple message to the blockchain
2. **read_contract** - Read data from smart contracts
3. **write_contract** - Write data to smart contracts
4. **deploy_contract** - Deploy new smart contracts

### Anthropic MCP Additional Features

- **Resources**: Access to network stats, contract info, transaction history
- **Prompts**: Predefined templates for common operations
- **Streaming**: Real-time updates and notifications

### Agent-MCP Additional Features

- **Agent Cards**: Capability discovery and metadata
- **Task Management**: Structured task processing
- **Message Handling**: Agent-to-agent communication
- **Artifact Generation**: Structured result outputs

## Architecture Comparison

| Feature | Anthropic MCP | Agent-MCP |
|---------|---------------|-----------|
| Protocol | JSON-RPC 2.0 | Custom Messages |
| Transport | stdio, SSE | HTTP, WebSocket |
| Discovery | Resource-based | Agent Card |
| State Management | Stateless | Stateful |
| Multi-Agent | Via shared servers | Native support |
| Industry Support | Very High | Experimental |

## Best Practices

### Security
- Always use environment variables for API keys
- Validate contract addresses before operations
- Implement proper error handling
- Use secure transport (HTTPS/WSS)

### Performance
- Reuse MCP connections when possible
- Implement connection pooling for high-volume use
- Use async/await patterns consistently
- Monitor rate limits and implement backoff

### Development
- Start with the examples provided
- Use the test suite to validate implementations
- Follow the existing code patterns
- Contribute back to the community

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check your API key is set correctly
   - Verify network connectivity
   - Ensure MCP server is running

2. **Authentication Errors**
   - Verify API key is valid
   - Check rate limits haven't been exceeded
   - Ensure proper permissions

3. **Contract Deployment Failures**
   - Verify Solidity syntax
   - Check constructor parameters
   - Ensure sufficient resources

### Getting Help

- Check the [examples](../examples/) directory
- Review the [API documentation](api-reference.md)
- Report issues on GitHub
- Join the community discussions

## Next Steps

1. **Explore the Examples**: Run the provided examples to understand the implementations
2. **Build Your First Agent**: Start with a simple use case
3. **Integrate with Your System**: Choose the approach that fits your architecture
4. **Contribute**: Help improve the implementation and add new features

## Resources

- [Anthropic MCP Documentation](https://modelcontextprotocol.io/)
- [Agent-MCP Framework](https://github.com/rinadelph/Agent-MCP)
- [Stability Protocol](https://stabilityprotocol.com/)
- [API Portal](https://portal.stabilityprotocol.com/)

---

Ready to start building with Stability MCP? Choose your approach and dive into the examples! 