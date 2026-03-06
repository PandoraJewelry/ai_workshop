#!/bin/bash
# Format Python code with Black and isort

set -e

echo "Running isort..."
isort app/ tests/ main.py

echo "Running Black..."
black app/ tests/ main.py

echo "✨ Code formatting complete!"
