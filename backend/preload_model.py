from transformers import pipeline
print("Preloading Bark model...")
synthesiser = pipeline("text-to-speech", "suno/bark-small")
print("Model loaded successfully!")