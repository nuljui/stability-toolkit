# Contributing to Stability Toolkit

We welcome contributions to the Stability Toolkit for LangChain. Whether it's a bug fix, new feature, or improvement to the documentation, your help is appreciated.

---

## 🧩 Project Structure

```
├── stability_toolkit.py         # Main toolkit and tools
├── test_stability_toolkit.py    # Unit tests for each tool
├── README.md                    # Project documentation
├── LICENSE                      # MIT license
├── pyproject.toml               # Poetry configuration
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions test runner
```

---

## 🛠 Requirements

* Python 3.8+
* Poetry (`pip install poetry`)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-org/stability-toolkit.git
cd stability-toolkit
poetry install
poetry shell
```

---

## 🧪 Running Tests

```bash
poetry run python -m unittest test_stability_toolkit.py
```

---

## 💡 Submitting a Pull Request

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to your fork
5. Open a Pull Request against `main`

---

## ✅ Coding Standards

* Follow [PEP8](https://peps.python.org/pep-0008/)
* Include type hints where possible
* Write/modify unit tests for new features

---

## 🧩 Toolkit Additions

If you're adding a new tool:

* Wrap the tool with a `Tool` class and description
* Add it to `StabilityToolkit.get_tools()`
* Write a unit test in `test_stability_toolkit.py`

---

## 📬 Questions?

Open an issue or email us at [contact@stabilityprotocol.com](mailto:contact@stabilityprotocol.com)
