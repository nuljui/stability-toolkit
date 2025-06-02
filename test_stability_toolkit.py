import unittest
from unittest.mock import patch, Mock
import json
from stability_toolkit import post_zkt_v1, call_contract_read, call_contract_write, deploy_contract

class TestStabilityToolkit(unittest.TestCase):
    def setUp(self):
        print("\n" + "="*50)
        print("Starting new test...")
        print("="*50)

    def tearDown(self):
        print("\n" + "-"*50)
        print("Test completed")
        print("-"*50 + "\n")

    @patch('stability_toolkit.requests.post')
    def test_post_zkt_v1(self, mock_post):
        print("\nTest: post_zkt_v1")
        print("Input: 'Hello, Blockchain!'")
        
        mock_response = Mock()
        mock_response.text = '{"success": true, "hash": "0xabc123"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        result = post_zkt_v1("Hello, Blockchain!")
        print(f"Response: {result}")
        
        # Print the mock request details
        if mock_post.call_args:
            args, kwargs = mock_post.call_args
            print("\nRequest Details:")
            print(f"URL: {args[0]}")
            print(f"Headers: {kwargs.get('headers')}")
            print(f"Payload: {json.dumps(kwargs.get('json'), indent=2)}")
        
        self.assertIn("success", result)
        self.assertIn("0xabc123", result)
        print("Test Status: PASSED")

    @patch('stability_toolkit.requests.post')
    def test_call_contract_read(self, mock_post):
        print("\nTest: call_contract_read")
        abi = ["function getFile(bytes32 fileHash) view returns (tuple(address owner, string fileName, bytes32 fileHash))"]
        args = ["0xhash"]
        print(f"Input - Contract: 0xcontract")
        print(f"Input - ABI: {abi}")
        print(f"Input - Method: getFile")
        print(f"Input - Args: {args}")

        mock_response = Mock()
        mock_response.text = '{"success": true, "output": ["0x123", "example.txt", "0xabc"]}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        result = call_contract_read("0xcontract", abi, "getFile", args)
        print(f"Response: {result}")
        
        # Print the mock request details
        if mock_post.call_args:
            args, kwargs = mock_post.call_args
            print("\nRequest Details:")
            print(f"URL: {args[0]}")
            print(f"Headers: {kwargs.get('headers')}")
            print(f"Payload: {json.dumps(kwargs.get('json'), indent=2)}")
        
        self.assertIn("success", result)
        self.assertIn("output", result)
        print("Test Status: PASSED")

    @patch('stability_toolkit.requests.post')
    def test_call_contract_write(self, mock_post):
        print("\nTest: call_contract_write")
        abi = ["function storeFile(string fileName, bytes32 fileHash)"]
        args = ["example.txt", "0xabc"]
        print(f"Input - Contract: 0xcontract")
        print(f"Input - ABI: {abi}")
        print(f"Input - Method: storeFile")
        print(f"Input - Args: {args}")

        mock_response = Mock()
        mock_response.text = '{"success": true, "hash": "0xdef456"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        result = call_contract_write("0xcontract", abi, "storeFile", args)
        print(f"Response: {result}")
        
        # Print the mock request details
        if mock_post.call_args:
            args, kwargs = mock_post.call_args
            print("\nRequest Details:")
            print(f"URL: {args[0]}")
            print(f"Headers: {kwargs.get('headers')}")
            print(f"Payload: {json.dumps(kwargs.get('json'), indent=2)}")
        
        self.assertIn("success", result)
        self.assertIn("0xdef456", result)
        print("Test Status: PASSED")

    @patch('stability_toolkit.requests.post')
    def test_deploy_contract(self, mock_post):
        print("\nTest: deploy_contract")
        code = "contract X { function x() public {} }"
        args = []
        print(f"Input - Code: {code}")
        print(f"Input - Args: {args}")

        mock_response = Mock()
        mock_response.text = '{"success": true, "contractAddress": "0xdeadbeef"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        result = deploy_contract(code, args)
        print(f"Response: {result}")
        
        # Print the mock request details
        if mock_post.call_args:
            args, kwargs = mock_post.call_args
            print("\nRequest Details:")
            print(f"URL: {args[0]}")
            print(f"Headers: {kwargs.get('headers')}")
            print(f"Payload: {json.dumps(kwargs.get('json'), indent=2)}")
        
        self.assertIn("success", result)
        self.assertIn("0xdeadbeef", result)
        print("Test Status: PASSED")

if __name__ == '__main__':
    unittest.main(verbosity=2)
