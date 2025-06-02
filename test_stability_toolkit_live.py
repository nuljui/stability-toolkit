import unittest
import json
import time
from stability_toolkit import post_zkt_v1, call_contract_read, call_contract_write, deploy_contract

class TestStabilityToolkitLive(unittest.TestCase):
    contract_address = None  # Class variable to store contract address

    @classmethod
    def setUpClass(cls):
        """Set up test environment before any tests run"""
        print("\n" + "="*50)
        print("Starting Live Blockchain Tests")
        print("="*50)
        
        # Use the try-it-out API key
        cls.api_key = "try-it-out"
        print(f"Using API key: {cls.api_key}")

    def setUp(self):
        """Set up before each test"""
        print("\n" + "-"*50)
        print("Starting new test...")
        print("-"*50)

    def tearDown(self):
        """Clean up after each test"""
        print("\n" + "-"*50)
        print("Test completed")
        print("-"*50 + "\n")

    def test_01_post_zkt_v1_live(self):
        """Test sending a real message to the blockchain"""
        print("\nTest: post_zkt_v1 (Live)")
        test_message = "Test message from live test"
        print(f"Input: {test_message}")
        
        try:
            result = post_zkt_v1(test_message, api_key=self.api_key)
            print(f"Response: {result}")
            
            # Parse the response
            response_data = json.loads(result)
            self.assertIn("success", response_data)
            self.assertIn("hash", response_data)
            print(f"Transaction Hash: {response_data['hash']}")
            print("Test Status: PASSED")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_02_deploy_contract_live(self):
        """Test deploying a real contract to the blockchain"""
        print("\nTest: deploy_contract (Live)")
        # Simple contract that stores a number
        contract_code = """pragma solidity ^0.8.0;
contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}"""
        wait = True
        print(f"Input - Code: {contract_code}")
        print(f"Input - wait: {wait}")
        try:
            result = deploy_contract(contract_code, [], wait, api_key=self.api_key)
            print(f"Response: {result}")
            
            # Parse the response
            response_data = json.loads(result)
            self.assertIn("success", response_data)
            self.assertIn("contractAddress", response_data)
            print(f"Contract Address: {response_data['contractAddress']}")
            
            # Store the contract address as a class variable
            TestStabilityToolkitLive.contract_address = response_data['contractAddress']
            print(f"✓ Stored contract address: {TestStabilityToolkitLive.contract_address}")
            print("Test Status: PASSED")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_03_call_contract_read_initial(self):
        """Test initial read from the deployed contract"""
        if not TestStabilityToolkitLive.contract_address:
            self.skipTest("No contract address available. Run deploy_contract test first.")
            
        print("\nTest: call_contract_read (Initial)")
        print(f"✓ Using stored contract address: {TestStabilityToolkitLive.contract_address}")
        abi = [
            "function set(uint256 x) public",
            "function get() public view returns (uint256)"
        ]
        arguments = []  # No arguments needed for get()
        print(f"Input - Contract: {TestStabilityToolkitLive.contract_address}")
        print(f"Input - Method: get")
        print(f"Input - arguments: {arguments}")
        
        try:
            result = call_contract_read(
                TestStabilityToolkitLive.contract_address,
                abi,
                "get",
                arguments,
                api_key=self.api_key
            )
            print(f"Response: {result}")
            
            # Parse the response
            response_data = json.loads(result)
            self.assertIn("success", response_data)
            self.assertIn("output", response_data)
            print(f"Initial Stored Value: {response_data['output']}")
            print("Test Status: PASSED")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_04_call_contract_write(self):
        """Test writing to the deployed contract"""
        if not TestStabilityToolkitLive.contract_address:
            self.skipTest("No contract address available. Run deploy_contract test first.")
            
        print("\nTest: call_contract_write (Live)")
        print(f"✓ Using stored contract address: {TestStabilityToolkitLive.contract_address}")
        abi = [
            "function set(uint256 x) public",
            "function get() public view returns (uint256)"
        ]
        arguments = ["42"]  # Set the stored value to 42
        wait = True
        print(f"Input - Contract: {TestStabilityToolkitLive.contract_address}")
        print(f"Input - Method: set")
        print(f"Input - arguments: {arguments}")
        print(f"Input - wait: {wait}")
        
        try:
            result = call_contract_write(
                TestStabilityToolkitLive.contract_address,
                abi,
                "set",
                arguments,
                wait,
                api_key=self.api_key
            )
            print(f"Response: {result}")
            
            # Parse the response
            response_data = json.loads(result)
            self.assertIn("success", response_data)
            self.assertIn("hash", response_data)
            print(f"Transaction Hash: {response_data['hash']}")
            print("Test Status: PASSED")
            
            # Wait 4 seconds for transaction confirmation
            print("Waiting for transaction confirmation...")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_05_call_contract_read_final(self):
        """Test final read from the deployed contract after write"""
        if not TestStabilityToolkitLive.contract_address:
            self.skipTest("No contract address available. Run deploy_contract test first.")
            
        print("\nTest: call_contract_read (Final)")
        print(f"✓ Using stored contract address: {TestStabilityToolkitLive.contract_address}")
        abi = [
            "function set(uint256 x) public",
            "function get() public view returns (uint256)"
        ]
        arguments = []  # No arguments needed for get()
        print(f"Input - Contract: {TestStabilityToolkitLive.contract_address}")
        print(f"Input - Method: get")
        print(f"Input - arguments: {arguments}")
        
        try:
            result = call_contract_read(
                TestStabilityToolkitLive.contract_address,
                abi,
                "get",
                arguments,
                api_key=self.api_key
            )
            print(f"Response: {result}")
            
            # Parse the response
            response_data = json.loads(result)
            self.assertIn("success", response_data)
            self.assertIn("output", response_data)
            print(f"Final Stored Value: {response_data['output']}")
            
            # Restore strict assertion
            self.assertEqual(response_data['output'], "42", "Contract value should be 42")
            print("✓ Value correctly updated!")
            print("Test Status: PASSED")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

if __name__ == '__main__':
    unittest.main(verbosity=2) 