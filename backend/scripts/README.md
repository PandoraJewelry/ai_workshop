# Development Scripts

This directory contains shell scripts for maintaining code quality throughout the development workflow.

## Available Scripts

### format.sh
**Purpose**: Auto-format Python code  
**Tools**: Black + isort  
**Usage**: `./scripts/format.sh`

Automatically formats all Python files according to project standards:
- Black formats code with 88-character line length
- isort organizes imports in Black-compatible style

Run this before committing to ensure consistent formatting.

### lint.sh
**Purpose**: Check code quality without modifying files  
**Tools**: Flake8 + mypy  
**Usage**: `./scripts/lint.sh`

Runs static analysis:
- Flake8 checks PEP8 compliance and common issues
- mypy performs type checking

Exit code 0 means all checks passed.

### test.sh
**Purpose**: Run test suite with coverage reporting  
**Tools**: pytest + pytest-cov  
**Usage**: `./scripts/test.sh`

Executes all tests and generates coverage reports:
- Terminal coverage summary
- HTML coverage report in `htmlcov/` directory

### quality.sh
**Purpose**: Run complete quality check pipeline  
**Tools**: Black + isort + Flake8 + mypy + pytest  
**Usage**: `./scripts/quality.sh`

Comprehensive quality checks:
1. Verify code formatting (Black --check + isort --check-only)
2. Check linting (Flake8 + mypy)
3. Run full test suite

This is the recommended pre-commit check. All checks must pass.

## Configuration Files

Quality tools are configured via:
- **pyproject.toml**: Black, isort, mypy, pytest, coverage settings
- **.flake8**: Flake8 specific rules

## Quick Start

```bash
# First time setup
uv pip install -r requirements.txt

# Format your code
./scripts/format.sh

# Check everything before commit
./scripts/quality.sh
```

## CI/CD Integration

These scripts are designed for easy integration with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Quality Checks
  run: ./scripts/quality.sh
```

## Troubleshooting

**Script permission denied**
```bash
chmod +x scripts/*.sh
```

**Tools not found**
```bash
# Make sure dependencies are installed
uv pip install -r requirements.txt
```

**Flake8 errors after formatting**
Run `./scripts/format.sh` first, then `./scripts/lint.sh`
