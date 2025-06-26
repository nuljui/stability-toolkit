#!/usr/bin/env python3

"""Comprehensive unit tests for Stability Toolkit."""

import unittest
import json
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add current directory to path for imports
sys.path.insert(0, '.')

from stability_toolkit import (
    StabilityToolkit, 
    post_zkt_v1, 
    call_contract_read, 
    call_contract_write, 
    deploy_contract,
    _post_request
)

class TestStabilityToolkitUnits(unittest.TestCase):
    """Comprehensive unit tests for Stability Toolkit."""

    def setUp(self):
        """Set up test fixtures."""
        self.api_key = "test-api-key"
        self.mock_response_success = '{"success": true, "hash": "0x123456789abcdef"}'
        self.mock_response_deploy = '{"success": true, "contractAddress": "0xabcdef123456789"}'

    @patch('stability_toolkit.requests')
    def test_post_request_success(self, mock_requests):
        """Test successful POST request."""
        # Mock successful response
        mock_response = Mock()
        mock_response.text = self.mock_response_success
        mock_requests.post.return_value = mock_response
        
        payload = {"test": "data"}
        result = _post_request(payload, self.api_key)
        
        # Verify request was made correctly
        mock_requests.post.assert_called_once_with(
            f"https://rpc.stabilityprotocol.com/zkt/{self.api_key}",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        # Verify response
        self.assertEqual(result, self.mock_response_success)

    @patch('stability_toolkit.requests')  
    def test_post_request_error(self, mock_requests):
        """Test POST request with network error."""
        # Mock network error
        mock_requests.post.side_effect = Exception("Network error")
        
        payload = {"test": "data"}
        result = _post_request(payload, self.api_key)
        
        # Verify error handling
        self.assertIn("Error: Network error", result)

    @patch('stability_toolkit._post_request')
    def test_post_zkt_v1(self, mock_post):
        """Test ZKT v1 message posting."""
        mock_post.return_value = self.mock_response_success
        
        message = "Test message"
        result = post_zkt_v1(message, self.api_key)
        
        # Verify correct payload
        expected_payload = {"arguments": message}
        mock_post.assert_called_once_with(expected_payload, self.api_key)
        self.assertEqual(result, self.mock_response_success)

    @patch('stability_toolkit._post_request')
    def test_call_contract_read(self, mock_post):
        """Test contract read functionality."""
        mock_response = '{"result": "Hello World"}'
        mock_post.return_value = mock_response
        
        to = "0x1234567890abcdef"
        abi = ["function getMessage() public view returns (string)"]
        method = "getMessage"
        arguments = []
        
        result = call_contract_read(to, abi, method, arguments, api_key=self.api_key)
        
        # Verify correct payload
        expected_payload = {
            "to": to,
            "abi": abi, 
            "method": method,
            "arguments": arguments,
            "id": 1
        }
        mock_post.assert_called_once_with(expected_payload, self.api_key)
        self.assertEqual(result, mock_response)

    @patch('stability_toolkit._post_request')
    def test_call_contract_write(self, mock_post):
        """Test contract write functionality."""
        mock_post.return_value = self.mock_response_success
        
        to = "0x1234567890abcdef"
        abi = ["function setMessage(string memory _msg) public"]
        method = "setMessage"
        arguments = ["Hello Blockchain!"]
        
        result = call_contract_write(to, abi, method, arguments, api_key=self.api_key)
        
        # Verify correct payload
        expected_payload = {
            "to": to,
            "abi": abi,
            "method": method, 
            "arguments": arguments,
            "id": 1,
            "wait": True
        }
        mock_post.assert_called_once_with(expected_payload, self.api_key)
        self.assertEqual(result, self.mock_response_success)

    @patch('stability_toolkit._post_request')
    def test_deploy_contract(self, mock_post):
        """Test contract deployment."""
        mock_post.return_value = self.mock_response_deploy
        
        contract_code = "pragma solidity ^0.8.0; contract Test {}"
        constructor_args = ["Hello", 42]
        
        result = deploy_contract(contract_code, constructor_args, api_key=self.api_key)
        
        # Verify correct payload
        expected_payload = {
            "code": contract_code,
            "arguments": constructor_args,
            "wait": False,
            "id": 1
        }
        mock_post.assert_called_once_with(expected_payload, self.api_key)
        self.assertEqual(result, self.mock_response_deploy)

    def test_stability_toolkit_creation(self):
        """Test StabilityToolkit creation and tool availability."""
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        
        # Verify toolkit has correct number of tools
        self.assertEqual(len(tools), 4)
        
        # Verify tool names
        tool_names = [tool.name for tool in tools]
        expected_names = [
            "StabilityWriteTool", 
            "StabilityReadTool",
            "StabilityWriteContractTool", 
            "StabilityDeployTool"
        ]
        self.assertEqual(tool_names, expected_names)

    @patch('stability_toolkit.post_zkt_v1')
    def test_stability_write_tool(self, mock_post_zkt):
        """Test StabilityWriteTool functionality."""
        mock_post_zkt.return_value = self.mock_response_success
        
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        write_tool = tools[0]  # First tool is write tool
        
        # Test tool execution
        result = write_tool.invoke({"arguments": "Test message"})
        
        mock_post_zkt.assert_called_once_with("Test message", "try-it-out")
        self.assertEqual(result, self.mock_response_success)

    @patch('stability_toolkit.deploy_contract')
    def test_stability_deploy_tool(self, mock_deploy):
        """Test StabilityDeployTool functionality."""
        mock_deploy.return_value = self.mock_response_deploy
        
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        deploy_tool = tools[3]  # Fourth tool is deploy tool
        
        # Test tool execution with JSON input
        deploy_input = json.dumps({
            "code": "contract Test {}",
            "arguments": ["hello"]
        })
        
        result = deploy_tool.invoke({"arguments": deploy_input})
        
        mock_deploy.assert_called_once_with(code="contract Test {}", arguments=["hello"], api_key="try-it-out")
        self.assertEqual(result, self.mock_response_deploy)

    def test_tool_descriptions(self):
        """Test that all tools have proper descriptions."""
        toolkit = StabilityToolkit()
        tools = toolkit.get_tools()
        
        for tool in tools:
            # Verify each tool has a description
            self.assertIsNotNone(tool.description)
            self.assertGreater(len(tool.description), 10)
            self.assertIn("Stability", tool.description)

    def test_api_key_defaults(self):
        """Test API key default behavior."""
        # Test default API key
        with patch('stability_toolkit._post_request') as mock_post:
            mock_post.return_value = self.mock_response_success
            
            result = post_zkt_v1("test message")
            
            # Should use default API key
            mock_post.assert_called_once_with(
                {"arguments": "test message"}, 
                "try-it-out"
            )

if __name__ == '__main__':
    print("🧪 Running Comprehensive Stability Toolkit Unit Tests")
    print("=" * 60)
    
    # Run tests with verbose output
    unittest.main(verbosity=2) 