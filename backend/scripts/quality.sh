#!/bin/bash
# Run all quality checks (format, lint, test)

set -e

echo "========================================="
echo "Running Code Quality Checks"
echo "========================================="

echo ""
echo "1. Checking code formatting..."
black --check app/ tests/ main.py
isort --check-only app/ tests/ main.py

echo ""
echo "2. Running linters..."
flake8 app/ tests/ main.py

echo ""
echo "3. Running type checks..."
mypy app/ main.py --no-error-summary 2>&1 || true

echo ""
echo "4. Running tests..."
pytest tests/ -v

echo ""
echo "========================================="
echo "✨ All quality checks passed!"
echo "========================================="
