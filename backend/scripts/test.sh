#!/bin/bash
# Run tests with coverage

set -e

echo "Running tests with coverage..."
pytest tests/ -v --cov=app --cov-report=term-missing --cov-report=html

echo ""
echo "✨ Tests complete! Coverage report generated in htmlcov/"
