# Audio Transcription Analysis

This folder contains Python-based AI/ML tools for processing clinician report data.

## Audio Transcription with Whisper Large V3

### Architecture Overview

The transcription system works by:

1. **Frontend** triggers transcription via "Transcribe Audio" button
2. **Next.js API** (`/api/transcribe`) downloads audio from GCS
3. **Python script** receives audio via stdin and transcribes it
4. **Transcript** is returned to frontend and displayed

**Key Design**: Audio flows through Next.js to Python, no direct GCS access needed in Python.

### Setup

1. **Install Python Dependencies**

```bash
# Navigate to the analysis folder
cd src/app/analysis

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

2. **Environment Variables** (Already configured)

Your `.env.local` should have:

```
GCP_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=intake-assessment-audio-files
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### Usage

#### Via Web Interface (Primary Method)

1. Open a patient report
2. Click on the "Story" card to open detail modal
3. Click "Transcribe Audio" button
4. Wait for transcription (1-2 minutes)
5. Transcript appears below audio player

#### Standalone Python Script (Testing)

```bash
# Test with a local audio file
python audio_transcription.py /path/to/audio.webm

# Test with piped audio (how API uses it)
cat audio.webm | python audio_transcription.py --stdin .webm
```

### Model Information

- **Model**: OpenAI Whisper Large V3
- **Source**: Hugging Face (`openai/whisper-large-v3`)
- **Capabilities**:
  - Multilingual transcription
  - High accuracy
  - Timestamps support
  - Works with various audio formats (webm, mp3, wav, etc.)

### Performance Considerations

- **GPU Recommended**: The model runs much faster with CUDA-enabled GPU
- **CPU Fallback**: Will use CPU if GPU is not available (slower)
- **Memory**: Requires ~10GB VRAM for GPU, ~16GB RAM for CPU
- **Processing Time**: ~1-2 minutes per hour of audio on GPU, longer on CPU

### Integration with Frontend

The transcription system is designed to work with the AudioPlayer component:

1. User plays audio in the AudioPlayer
2. "Transcribe" button triggers the `/api/transcribe` endpoint
3. Python service processes the audio
4. Transcript is displayed below the AudioPlayer in StoryDetail

### Future Enhancements

- [ ] Add database storage for transcripts
- [ ] Implement caching to avoid re-transcribing
- [ ] Add speaker diarization (identify different speakers)
- [ ] Support batch transcription
- [ ] Add progress tracking for long audio files
- [ ] Implement webhook for async transcription
- [ ] Add confidence scores and metadata

### Troubleshooting

**Import errors**: Make sure all dependencies are installed

```bash
pip install -r requirements.txt
```

**CUDA errors**: Check PyTorch CUDA compatibility

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

**GCS authentication errors**: Verify GOOGLE_APPLICATION_CREDENTIALS is set correctly

**Out of memory**: Reduce batch_size in the pipeline configuration or use CPU

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   AudioPlayer Component + Transcribe Button           │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │ HTTP POST                          │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │      StoryDetail (DetailPanels.tsx)                   │  │
│  │              - Display transcript                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│              Next.js API Route                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     /api/transcribe/route.ts                          │  │
│  │         1. Validate auth & ownership                  │  │
│  │         2. Download audio from GCS                    │  │
│  │         3. Pipe audio to Python via stdin             │  │
│  │         4. Return transcript                          │  │
│  └─────────────────────┬────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────┘
                         │ stdin pipe
                         │
┌────────────────────────▼───────────────────────────────────┐
│               Python Transcription Service                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    audio_transcription.py                             │  │
│  │         - Read audio from stdin                       │  │
│  │         - Load Whisper model                          │  │
│  │         - Transcribe audio                            │  │
│  │         - Output JSON to stdout                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │
┌────────────────────────┼───────────────────────────────────┐
│         Google Cloud Storage (via Next.js)                  │
│         Audio files: userId/fieldName-timestamp.webm        │
└─────────────────────────────────────────────────────────────┘
```
