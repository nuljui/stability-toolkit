import unittest
from unittest.mock import patch, Mock
from stability_toolkit import post_zkt_v1, call_contract_read, call_contract_write, deploy_contract

class TestStabilityToolkit(unittest.TestCase):

    @patch('stability_toolkit.requests.post')
    def test_post_zkt_v1(self, mock_post):
        mock_response = Mock()
        mock_response.text = '{"success": true, "hash": "0xabc123"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        result = post_zkt_v1("Hello, Blockchain!")
        self.assertIn("success", result)
        self.assertIn("0xabc123", result)

    @patch('stability_toolkit.requests.post')
    def test_call_contract_read(self, mock_post):
        mock_response = Mock()
        mock_response.text = '{"success": true, "output": ["0x123", "example.txt", "0xabc"]}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        abi = ["function getFile(bytes32 fileHash) view returns (tuple(address owner, string fileName, bytes32 fileHash))"]
        args = ["0xhash"]
        result = call_contract_read("0xcontract", abi, "getFile", args)
        self.assertIn("success", result)
        self.assertIn("output", result)

    @patch('stability_toolkit.requests.post')
    def test_call_contract_write(self, mock_post):
        mock_response = Mock()
        mock_response.text = '{"success": true, "hash": "0xdef456"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        abi = ["function storeFile(string fileName, bytes32 fileHash)"]
        args = ["example.txt", "0xabc"]
        result = call_contract_write("0xcontract", abi, "storeFile", args)
        self.assertIn("success", result)
        self.assertIn("0xdef456", result)

    @patch('stability_toolkit.requests.post')
    def test_deploy_contract(self, mock_post):
        mock_response = Mock()
        mock_response.text = '{"success": true, "contractAddress": "0xdeadbeef"}'
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        code = "contract X { function x() public {} }"
        args = []
        result = deploy_contract(code, args)
        self.assertIn("success", result)
        self.assertIn("0xdeadbeef", result)

if __name__ == '__main__':
    unittest.main()
