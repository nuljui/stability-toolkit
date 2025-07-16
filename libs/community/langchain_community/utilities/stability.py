"""Stability API utility functions and wrapper."""

import json
import os
from typing import Any, List

# Environment variable support for API key
DEFAULT_API_KEY = os.getenv("STABILITY_API_KEY", "try-it-out")
API_URL_TEMPLATE = "https://rpc.stabilityprotocol.com/zkt/{}"
HEADERS = {"Content-Type": "application/json"}

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None  # type: ignore


def _sanitize_api_key_for_logging(api_key: str) -> str:
    """Sanitize API key for logging to prevent exposure."""
    if not api_key or api_key == "try-it-out":
        return api_key
    return f"{api_key[:8]}...{api_key[-4:]}" if len(api_key) > 12 else "***"


def _post_request(payload: dict, api_key: str = DEFAULT_API_KEY) -> str:
    """Send a POST request to the Stability API and return the response text."""
    if requests is None:
        raise RuntimeError("requests library is required")
    
    # Warn about try-it-out key limitations
    if api_key == "try-it-out":
        print("⚠️  Warning: Using 'try-it-out' API key (limited functionality)")
        print("   For production use, get a FREE API key at: https://portal.stabilityprotocol.com/")
        print("   Free tier: 1000 writes/month, 200 reads/minute, up to 3 keys")
    
    url = API_URL_TEMPLATE.format(api_key)
    try:
        response = requests.post(url, headers=HEADERS, json=payload)
        return response.text
    except Exception as e:  # pragma: no cover
        # Sanitize any potential API key exposure in error messages
        error_msg = str(e).replace(api_key, _sanitize_api_key_for_logging(api_key))
        return f"Error: {error_msg}"


class StabilityAPIWrapper:
    """Wrapper for Stability API.
    
    This wrapper provides access to the Stability blockchain through Zero Gas 
    Transaction (ZKT) API endpoints.
    
    Args:
        api_key: Stability API key. If not provided, will use STABILITY_API_KEY 
                environment variable or default to "try-it-out"
    
    Environment Variables:
        STABILITY_API_KEY: Your Stability API key (recommended for production)
    
    Getting Your FREE API Key:
        Visit https://portal.stabilityprotocol.com/ to get your free API key.
        Free tier includes:
        - Up to 3 API keys per account
        - 1,000 write transactions per month  
        - 200 read operations per minute
        - Completely free access
    
    Support:
        Email: contact@stabilityprotocol.com
        Portal: https://portal.stabilityprotocol.com/
    """
    
    def __init__(self, api_key: str | None = None):
        """Initialize the Stability API wrapper.
        
        Args:
            api_key: Stability API key. If None, uses environment variable
                    STABILITY_API_KEY or defaults to "try-it-out"
        """
        self.api_key = api_key or DEFAULT_API_KEY
        
        # Validate API key
        if not self.api_key:
            raise ValueError(
                "API key is required. Get a FREE API key at https://portal.stabilityprotocol.com/ "
                "or set STABILITY_API_KEY environment variable"
            )
    
    def post_zkt_v1(self, arguments: str) -> str:
        """Send a simple string message to the blockchain."""
        payload = {"arguments": arguments}
        return _post_request(payload, self.api_key)
    
    def call_contract_read(
        self,
        to: str,
        abi: List[str],
        method: str,
        arguments: List[Any],
        id: int = 1,
    ) -> str:
        """Execute a read-only smart contract call."""
        payload = {
            "to": to,
            "abi": abi,
            "method": method,
            "arguments": arguments,
            "id": id,
        }
        return _post_request(payload, self.api_key)
    
    def call_contract_write(
        self,
        to: str,
        abi: List[str],
        method: str,
        arguments: List[Any],
        wait: bool = True,
        id: int = 1,
    ) -> str:
        """Execute a state-changing smart contract call."""
        payload = {
            "to": to,
            "abi": abi,
            "method": method,
            "arguments": arguments,
            "id": id,
            "wait": wait,
        }
        return _post_request(payload, self.api_key)
    
    def deploy_contract(
        self,
        code: str,
        arguments: List[Any] | None = None,
        wait: bool = False,
        id: int = 1,
    ) -> str:
        """Deploy a Solidity contract to the blockchain."""
        payload = {
            "code": code,
            "arguments": arguments or [],
            "wait": wait,
            "id": id,
        }
        return _post_request(payload, self.api_key) 