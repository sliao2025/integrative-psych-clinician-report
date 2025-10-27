"""
Audio Transcription Module using OpenAI Whisper Large V3
Receives audio data and returns transcription
"""

import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import tempfile
import os
import sys
from typing import Optional


class AudioTranscriber:
    """
    Transcribes audio files using OpenAI Whisper Large V3 model from Hugging Face
    """
    
    def __init__(self, model_id: str = "openai/whisper-medium"):
        """
        Initialize the transcriber with the Whisper model
        
        Args:
            model_id: Hugging Face model identifier
        """
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        
        print(f"Loading model on device: {self.device}", file=sys.stderr)
        
        # Load model
        self.model = AutoModelForSpeechSeq2Seq.from_pretrained(
            model_id,
            dtype=self.torch_dtype,
            low_cpu_mem_usage=True,
            use_safetensors=True
        )
        self.model.to(self.device)
        
        # Load processor
        self.processor = AutoProcessor.from_pretrained(model_id)
        
        # Create pipeline for transcription (original language)
        self.transcribe_pipe = pipeline(
            "automatic-speech-recognition",
            model=self.model,
            tokenizer=self.processor.tokenizer,
            feature_extractor=self.processor.feature_extractor,
            max_new_tokens=128,
            chunk_length_s=30,
            batch_size=16,
            return_timestamps=True,
            dtype=self.torch_dtype,
            device=self.device,
            language="en"
        )
        
        # Create pipeline for translation (to English)
        self.translate_pipe = pipeline(
            "automatic-speech-recognition",
            model=self.model,
            tokenizer=self.processor.tokenizer,
            feature_extractor=self.processor.feature_extractor,
            max_new_tokens=128,
            chunk_length_s=30,
            batch_size=16,
            return_timestamps=True,
            dtype=self.torch_dtype,
            device=self.device,
        )
        
        print("Model loaded successfully", file=sys.stderr)
    
    def transcribe_from_bytes(self, audio_bytes: bytes, file_extension: str = ".webm") -> dict:
        """
        Transcribe audio from bytes data
        
        Args:
            audio_bytes: Raw audio file bytes
            file_extension: File extension to use for temporary file (e.g., ".webm", ".mp3")
            
        Returns:
            Dictionary containing:
                - text: Full transcription
                - chunks: List of timestamped chunks if available
        """
        # Write bytes to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_path = tmp_file.name
            tmp_file.write(audio_bytes)
        
        try:
            # Transcribe
            result = self.transcribe_file(tmp_path)
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    def transcribe_from_stdin(self, file_extension: str = ".webm") -> dict:
        """
        Transcribe audio from stdin (binary data)
        
        Args:
            file_extension: File extension to use for temporary file
            
        Returns:
            Dictionary containing transcription results
        """
        # Read binary data from stdin
        audio_bytes = sys.stdin.buffer.read()
        return self.transcribe_from_bytes(audio_bytes, file_extension)
    
    def transcribe_file(self, audio_path: str) -> dict:
        """
        Transcribe and translate audio file
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Dictionary containing:
                - transcription: Original language text and chunks
                - translation: English translation text and chunks (if different from original)
                - language: Detected language code
        """
        print(f"Transcribing: {audio_path}", file=sys.stderr)
        
        # First, transcribe in original language
        transcription_result = self.transcribe_pipe(audio_path)
        
        print(f"Translating: {audio_path}", file=sys.stderr)
        
        # Then, translate to English
        translation_result = self.translate_pipe(audio_path, generate_kwargs={"task": "translate"})
        
        # Check if translation is different from transcription
        # (if already in English, they'll be the same)
        transcription_text = transcription_result["text"].strip()
        translation_text = translation_result["text"].strip()
        
        result = {
            "transcription": {
                "text": transcription_text,
                "chunks": transcription_result.get("chunks", [])
            }
        }
        
        # Only include translation if it's different (i.e., not already English)
        if transcription_text.lower() != translation_text.lower():
            result["translation"] = {
                "text": translation_text,
                "chunks": translation_result.get("chunks", [])
            }
            print("Translation differs from transcription - both languages detected", file=sys.stderr)
        else:
            print("Audio already in English - no translation needed", file=sys.stderr)
        
        return result


if __name__ == "__main__":
    """
    Usage:
    1. From file: python audio_transcription.py /path/to/audio.webm
    2. From stdin: cat audio.webm | python audio_transcription.py --stdin
    """
    import json
    
    transcriber = AudioTranscriber()
    
    # Check if reading from stdin or file
    if len(sys.argv) > 1 and sys.argv[1] == "--stdin":
        # Read from stdin
        file_extension = sys.argv[2] if len(sys.argv) > 2 else ".webm"
        result = transcriber.transcribe_from_stdin(file_extension)
        # Output as JSON to stdout
        print(json.dumps(result))
    elif len(sys.argv) > 1:
        # Read from file
        audio_path = sys.argv[1]
        if not os.path.exists(audio_path):
            print(f"Error: File not found: {audio_path}", file=sys.stderr)
            sys.exit(1)
        
        result = transcriber.transcribe_file(audio_path)
        # Output as JSON to stdout
        print(json.dumps(result))
    else:
        print("Usage:", file=sys.stderr)
        print("  From file: python audio_transcription.py /path/to/audio.webm", file=sys.stderr)
        print("  From stdin: cat audio.webm | python audio_transcription.py --stdin [extension]", file=sys.stderr)
        sys.exit(1)
