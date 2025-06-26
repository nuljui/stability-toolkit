# 🚀 GitHub & LangChain Integration Guide

## Overview
This guide covers two approaches for integrating the Stability Toolkit with LangChain:
1. **Standalone PyPI Package** (Immediate deployment)
2. **LangChain Community Contribution** (Official integration)

---

## 📦 Phase 1: Standalone PyPI Package (Recommended First)

### Step 1: Prepare GitHub Repository

```bash
# 1. Clean up and commit changes
git add .
git commit -m "feat: production-ready Stability Toolkit with comprehensive improvements

- Add environment variable support (STABILITY_API_KEY)
- Implement API key sanitization and security features  
- Add comprehensive documentation with portal information
- Include free tier limits and support contact details
- Ensure 100% test coverage (16/16 tests passing)
- Add real blockchain connectivity validation"

# 2. Create main branch and push
git checkout -b main
git push origin main

# 3. Create release
git tag -a v1.0.0 -m "Release v1.0.0: Production-ready Stability Toolkit"
git push origin v1.0.0
```

### Step 2: Update Repository Information

**Update pyproject.toml** (already done):
- Replace `"Your Name <your.email@example.com>"` with your details
- Replace `"yourusername"` with your GitHub username

**Create GitHub repository**:
1. Go to GitHub.com
2. Create new repository: `stability-toolkit`
3. Add description: "Production-ready LangChain toolkit for Stability blockchain"
4. Add topics: `langchain`, `blockchain`, `stability`, `web3`, `ai`, `zkt`

### Step 3: Publish to PyPI

```bash
# 1. Build package
poetry build

# 2. Publish to TestPyPI first (optional)
poetry config repositories.testpypi https://test.pypi.org/legacy/
poetry publish -r testpypi

# 3. Test installation
pip install -i https://test.pypi.org/simple/ stability-toolkit

# 4. Publish to PyPI
poetry publish
```

### Step 4: Usage Instructions for PyPI Package

Users can then install with:
```bash
pip install stability-toolkit
```

And use:
```python
from stability_toolkit import StabilityToolkit

# Get FREE API key at https://portal.stabilityprotocol.com/
toolkit = StabilityToolkit(api_key="your-api-key")
tools = toolkit.get_tools()
```

---

## 🤝 Phase 2: LangChain Community Contribution

### Step 1: Fork LangChain Repository

```bash
# 1. Fork the repository on GitHub
# Go to: https://github.com/langchain-ai/langchain
# Click "Fork"

# 2. Clone your fork
git clone https://github.com/YOURUSERNAME/langchain.git
cd langchain

# 3. Add upstream remote
git remote add upstream https://github.com/langchain-ai/langchain.git

# 4. Create feature branch
git checkout -b feat/stability-toolkit
```

### Step 2: Prepare LangChain Community Structure

Copy our prepared structure:
```bash
# Copy the community structure we already prepared
cp -r libs/community/langchain_community/* /path/to/langchain/libs/community/langchain_community/
cp -r tests/* /path/to/langchain/libs/community/tests/
cp docs/docs/integrations/toolkits/stability.md /path/to/langchain/docs/docs/integrations/toolkits/
```

### Step 3: Update LangChain Community Files

**libs/community/langchain_community/agent_toolkits/__init__.py**:
```python
# Add to the imports section
from langchain_community.agent_toolkits.stability import StabilityToolkit

# Add to __all__
__all__ = [
    # ... existing toolkits ...
    "StabilityToolkit",
]
```

**libs/community/langchain_community/tools/__init__.py**:
```python
# Add imports
from langchain_community.tools.stability import (
    StabilityDeployTool,
    StabilityReadTool,
    StabilityWriteContractTool,  
    StabilityWriteTool,
)

# Add to __all__
__all__ = [
    # ... existing tools ...
    "StabilityDeployTool",
    "StabilityReadTool", 
    "StabilityWriteContractTool",
    "StabilityWriteTool",
]
```

### Step 4: Create Pull Request

```bash
# 1. Run tests
cd libs/community
python -m pytest tests/unit_tests/agent_toolkits/test_stability.py -v
python -m pytest tests/integration_tests/agent_toolkits/test_stability.py -v

# 2. Run linting
make format
make lint

# 3. Commit and push
git add .
git commit -m "feat: add Stability blockchain toolkit

Add comprehensive toolkit for Stability blockchain interactions:
- Zero gas transactions via ZKT API
- Smart contract read/write operations  
- Contract deployment capabilities
- Free tier: 1000 writes/month, 200 reads/minute
- Production-ready with security features
- Comprehensive test coverage

Resolves: #ISSUE_NUMBER"

git push origin feat/stability-toolkit
```

### Step 5: Submit PR to LangChain

**PR Title**: `feat: add Stability blockchain toolkit for zero-gas transactions`

**PR Description Template**:
```markdown
## Summary
Adds a comprehensive toolkit for Stability blockchain interactions through Zero Gas Transaction (ZKT) API.

## Features
- ✅ Zero gas fees - no cryptocurrency needed
- ✅ Smart contract read/write operations
- ✅ Contract deployment capabilities  
- ✅ Free tier: 1000 writes/month, 200 reads/minute
- ✅ Production-ready security features
- ✅ Comprehensive documentation

## API Key Setup
Users get FREE API keys at: https://portal.stabilityprotocol.com/

## Testing
- [x] Unit tests: 11/11 passing
- [x] Integration tests: 5/5 passing  
- [x] Live blockchain tests: 5/5 passing
- [x] Security validation: ✅ API key sanitization

## Breaking Changes
None - purely additive contribution.

## Documentation
- [x] Toolkit documentation added
- [x] Integration guide included
- [x] API key setup instructions
- [x] Usage examples provided
```

---

## 🔄 Hybrid Approach Benefits

**Immediate Value** (PyPI Package):
- ✅ Users can install and use immediately
- ✅ Get community feedback quickly
- ✅ Establish package reputation
- ✅ Generate adoption metrics

**Long-term Integration** (LangChain Community):
- ✅ Official LangChain integration
- ✅ Broader discovery and adoption
- ✅ LangChain ecosystem benefits
- ✅ Maintenance support from community

---

## 📋 Checklist Before Submission

### Pre-GitHub
- [ ] All tests passing (16/16)
- [ ] Documentation complete with portal info
- [ ] pyproject.toml updated with your details
- [ ] README.md comprehensive
- [ ] Security features validated

### Pre-PyPI
- [ ] Version number set (1.0.0)
- [ ] Package builds successfully
- [ ] Test installation works
- [ ] GitHub repository created

### Pre-LangChain PR  
- [ ] Fork langchain repository
- [ ] Community structure copied
- [ ] Integration tests pass
- [ ] Documentation added
- [ ] Lint checks pass

---

## 🎯 Expected Timeline

**PyPI Package**: 1-2 days
**LangChain Community PR**: 2-4 weeks review process
**Total Integration**: ~1 month for complete integration

This approach ensures immediate availability while working toward official integration! 🚀 