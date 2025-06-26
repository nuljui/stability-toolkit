#!/usr/bin/env python3
"""Setup script for stability-toolkit package."""

from setuptools import setup, find_packages
import pathlib

# Read the README file
HERE = pathlib.Path(__file__).parent
README = (HERE / "README.md").read_text()

# Read requirements
def read_requirements():
    requirements = []
    with open('requirements.txt', 'r') as f:
        requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    return requirements

setup(
    name="stability-toolkit",
    version="1.0.0",
    description="A production-ready LangChain toolkit for Stability blockchain interactions without gas fees",
    long_description=README,
    long_description_content_type="text/markdown",
    url="https://github.com/nuljui/stability-toolkit",
    author="Juliun",
    author_email="contact@stabilityprotocol.com",
    license="MIT",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10", 
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    keywords="langchain blockchain stability zkt web3 ai agents",
    py_modules=["stability_toolkit"],
    python_requires=">=3.9",
    install_requires=[
        "requests>=2.25.0",
        "langchain-core>=0.1.0",
        "pydantic>=1.10.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0", 
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
        "langchain": [
            "langchain-openai>=0.1.0",
        ],
    },
    project_urls={
        "Bug Tracker": "https://github.com/nuljui/stability-toolkit/issues",
        "Support": "mailto:contact@stabilityprotocol.com",
        "Portal": "https://portal.stabilityprotocol.com/",
        "Documentation": "https://github.com/nuljui/stability-toolkit#readme",
    },
) 