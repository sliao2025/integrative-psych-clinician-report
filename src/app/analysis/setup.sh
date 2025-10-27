#!/bin/bash

# Audio Transcription Setup Script
# This script helps set up the Python environment for audio transcription

echo "🎙️  Audio Transcription Setup"
echo "================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or later."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Navigate to analysis directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
else
    echo "✅ Virtual environment already exists"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1

# Install dependencies
echo "📦 Installing dependencies (this may take a few minutes)..."
pip install -r requirements.txt

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To use the transcription service:"
echo "1. Activate the virtual environment:"
echo "   source src/app/analysis/venv/bin/activate"
echo ""
echo "2. Run transcription:"
echo "   python src/app/analysis/audio_transcription.py <gcs-file-path>"
echo ""
echo "3. Or use it in your Python code:"
echo "   from audio_transcription import transcribe_audio_from_gcs"
echo ""
echo "For more information, see README.md"
echo "================================"
