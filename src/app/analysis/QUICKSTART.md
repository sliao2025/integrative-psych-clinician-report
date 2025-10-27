# Quick Start: Audio Transcription

## Setup (One-time)

```bash
# Run the setup script
./src/app/analysis/setup.sh
```

This will:

- Create a Python virtual environment
- Install all required dependencies (PyTorch, Transformers, etc.)

## Usage

### Option 1: Via Web Interface (Recommended)

1. Open a patient report
2. Click on the "Story" card to open the detail modal
3. If there's an audio recording, you'll see the AudioPlayer
4. Click the "Transcribe Audio" button
5. Wait for the transcription to complete (may take 1-2 minutes)
6. The transcript will appear below the audio player

### Option 2: Via Command Line

```bash
# Activate virtual environment
source src/app/analysis/venv/bin/activate

# Transcribe a file
python src/app/analysis/audio_transcription.py userId/storyNarrative-123456.webm
```

### Option 3: Via Python Code

```python
from audio_transcription import transcribe_audio_from_gcs

# Transcribe
transcript = transcribe_audio_from_gcs("userId/storyNarrative-123456.webm")
print(transcript)
```

## Requirements

- Python 3.8 or later
- 10GB+ free disk space (for model weights)
- 16GB+ RAM (or 10GB+ VRAM if using GPU)
- Google Cloud credentials configured

## Troubleshooting

**"Module not found" errors**:

- Make sure you've run `./setup.sh`
- Activate the virtual environment: `source src/app/analysis/venv/bin/activate`

**Slow transcription**:

- First run downloads the model (~3GB), subsequent runs are faster
- GPU is recommended for faster processing
- Each minute of audio takes ~10-30 seconds to transcribe on GPU

**Memory errors**:

- Close other applications
- Use a smaller model: Change `openai/whisper-large-v3` to `openai/whisper-base` in the code

## Next Steps

Once the basic transcription is working, you can:

- Add database storage for transcripts
- Implement caching to avoid re-transcribing
- Add speaker diarization
- Support batch processing
- Add confidence scores and metadata
