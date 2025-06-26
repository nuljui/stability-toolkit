import unittest
from unittest.mock import patch, Mock
import json
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from stability_toolkit import StabilityToolkit, post_zkt_v1, call_contract_read, call_contract_write, deploy_contract
from langchain import hub

class TestStabilityToolkitLangChain(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test environment before any tests run"""
        # Use the try-it-out API key for live tests
        cls.api_key = "try-it-out"

    @patch('langchain_openai.ChatOpenAI')
    @patch('stability_toolkit.deploy_contract')
    def test_agent_deploy_contract_mock(self, mock_deploy, mock_chat):
        """Test the agent's ability to deploy a contract using mocked responses"""
        
        # Mock the contract deployment response
        mock_deploy.return_value = json.dumps({
            "success": True,
            "contractAddress": "0x1234567890abcdef"
        })
        
        # Mock the LLM responses
        mock_chat_instance = Mock()
        mock_chat_instance.invoke.side_effect = [
            {"content": "I need to deploy a contract that stores a greeting and a value. I'll use the StabilityDeployTool."},
            {"content": "I'll create a simple contract with a greeting string and a uint value."},
            {"content": "Here's the contract code I'll deploy:"},
            {"content": """pragma solidity ^0.8.0;
contract GreetingStorage {
    string private greeting;
    uint256 private value;
    
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}"""}
        ]
        mock_chat.return_value = mock_chat_instance
        
        # Initialize the agent (API key will be mocked)
        llm = ChatOpenAI(model="gpt-4", temperature=0)
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        
        # Create the ReAct agent
        tool_names = ", ".join([tool.name for tool in tools])
        tool_descriptions = "\n".join([f"{tool.name}: {tool.description}" for tool in tools])
        prompt = PromptTemplate(
            input_variables=["input", "agent_scratchpad", "tools", "tool_names"],
            template="""Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
{agent_scratchpad}"""
        )
        agent = create_react_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
        
        # Run the agent
        response = agent_executor.invoke({"input": "Deploy a contract that stores a greeting and a value"})
        
        # Verify the mock was called
        mock_deploy.assert_called_once()
        self.assertIn("0x", response['output'])

    def test_agent_deploy_contract_live(self):
        """Test the agent's ability to deploy a contract using live blockchain"""
        
        # Initialize the agent with live components
        llm = ChatOpenAI(model="gpt-4", temperature=0)
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        
        # Create the ReAct agent
        tool_names = ", ".join([tool.name for tool in tools])
        tool_descriptions = "\n".join([f"{tool.name}: {tool.description}" for tool in tools])
        prompt = PromptTemplate(
            input_variables=["input", "agent_scratchpad", "tools", "tool_names"],
            template="""Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
{agent_scratchpad}"""
        )
        agent = create_react_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
        
        # Run the agent
        response = agent_executor.invoke({"input": "Deploy a contract that stores a greeting and a value"})
        
        # Verify the response contains a contract address
        self.assertIn("0x", response['output'])

if __name__ == '__main__':
    unittest.main(verbosity=2) 