#!/bin/bash
# Run linting checks

set -e

echo "Running Flake8..."
flake8 app/ tests/ main.py

echo "Running mypy..."
mypy app/ main.py --no-error-summary 2>&1 || true

echo "✨ Linting complete!"
