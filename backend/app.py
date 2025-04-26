from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS
from transformers import pipeline
import scipy.io.wavfile
import numpy as np
import io
import logging
import re

app = Flask(__name__, static_folder="../frontend", static_url_path="/")
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

MODEL_NAME = "suno/bark-small"
MAX_PROMPT_LENGTH = 200
MAX_LYRICS_LENGTH = 2000
SAMPLE_RATE = 24000

try:
    logger.info(f"Loading model: {MODEL_NAME}")
    synthesiser = pipeline("text-to-speech", model=MODEL_NAME, device="cpu")
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    text = data.get('text', '').strip()
    voice_style = data.get('voiceStyle', '').strip()
    prompt_type = data.get('promptType', '').strip()
    input_type = data.get('inputType', 'prompt').strip()
    
    if not text:
        logger.warning("Empty text received")
        return {"error": "Text is required"}, 400
    
    # Set max length based on input type
    max_length = MAX_LYRICS_LENGTH if input_type == 'lyrics' else MAX_PROMPT_LENGTH
    if len(text) > max_length:
        text = text[:max_length]
        logger.info(f"Text truncated to {max_length} characters")
    
    # Format text with voice style and prompt type
    formatted_text = text
    if voice_style:
        voice_style = voice_style.upper()
        formatted_text = f"[{voice_style}] {text}"
    if prompt_type:
        prompt_type = prompt_type.upper()
        formatted_text = f"[{prompt_type}] {formatted_text}"
    
    # Sanitize input
    formatted_text = re.sub(r'[^\w\s.,!?\-\'\"\[\]]', '', formatted_text)
    if len(formatted_text) > max_length:
        formatted_text = formatted_text[:max_length]

    try:
        logger.info(f"Generating audio for {input_type}: {formatted_text[:50]}...")
        
        speech = synthesiser(formatted_text)
        
        if not speech or "audio" not in speech:
            logger.error("Invalid speech output from model")
            return {"error": "Failed to generate audio"}, 500

        audio_data = speech["audio"]
        sampling_rate = speech.get("sampling_rate", SAMPLE_RATE)
        
        logger.debug(f"Audio array shape: {audio_data.shape}")
        logger.debug(f"First sample values: {audio_data[0][:5] if len(audio_data.shape) > 1 else audio_data[:5]}")
        logger.debug(f"Audio data type: {audio_data.dtype}")
        
        if isinstance(audio_data, np.ndarray):
            if len(audio_data.shape) > 1:
                audio_data = np.mean(audio_data, axis=0)
            
            if audio_data.dtype != np.float32:
                audio_data = audio_data.astype(np.float32)
            
            if np.max(np.abs(audio_data)) > 1.0:
                audio_data = audio_data / np.max(np.abs(audio_data))
            
            audio_data = (audio_data * 32767).astype(np.int16)
        else:
            logger.error("Audio data is not a numpy array")
            return {"error": "Invalid audio format"}, 500

        wav_io = io.BytesIO()
        scipy.io.wavfile.write(wav_io, sampling_rate, audio_data)
        wav_io.seek(0)

        wav_size = wav_io.getbuffer().nbytes
        logger.info(f"Generated WAV file size: {wav_size} bytes")
        
        if wav_size <= 1024:
            logger.error("Generated WAV file is too small, likely empty")
            return {"error": "Audio generation failed - empty output"}, 500

        logger.info("Audio generated successfully")
        return send_file(
            wav_io,
            mimetype="audio/wav",
            as_attachment=True,
            download_name="generated_audio.wav"
        )

    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}", exc_info=True)
        return {"error": f"Audio generation failed: {str(e)}"}, 500

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=5000)