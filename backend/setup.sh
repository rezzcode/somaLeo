#!/bin/bash
# Quick start script for CBC AI Tutor Backend

echo "🎓 CBC AI Tutor Backend Setup"
echo "=============================="
echo ""

# Check Python
echo "✓ Checking Python installation..."
python --version

# Install dependencies
echo ""
echo "✓ Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "✓ Creating .env file..."
    cp .env.example .env
    echo "  Note: Edit .env to add your OpenAI API key if needed"
fi

# Done
echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  python -m uvicorn main:app --reload"
echo ""
echo "The API will be available at: http://localhost:8000"
echo "API documentation: http://localhost:8000/docs"
echo ""
echo "To run tests (in another terminal):"
echo "  python test_api.py"
