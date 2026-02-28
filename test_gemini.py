"""Quick diagnostic: tests Gemini connectivity with the key sourced from backend/.env"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from pathlib import Path
from dotenv import load_dotenv

# Load the real key from backend/.env
load_dotenv(Path("backend") / ".env", override=True)

api_key = os.environ.get("GEMINI_API_KEY", "")
print(f"Key prefix: {api_key[:8]}...")

try:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello",
        config=types.GenerateContentConfig(temperature=0.1)
    )
    print("SUCCESS:", response.text[:100])
except Exception as e:
    print("ERROR:", type(e).__name__, str(e)[:300])
