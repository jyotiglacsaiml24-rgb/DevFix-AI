
import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key) if api_key else None


def fix_code(language: str, code: str, error: str):
    if not client:
        raise ValueError(
            "GEMINI_API_KEY is missing. Add it to backened/.env"
        )

    prompt = f"""
You are DevFix AI, an expert coding assistant.

Analyze the following code error and suggest a correct fix.

Language: {language}

Code:
{code}

Error:
{error}

Return ONLY valid JSON with these keys:
{{
  "explanation": "Explain the error simply",
  "root_cause": "Explain the root cause",
  "fixed_code": "Provide the complete corrected code",
  "confidence": "High, Medium, or Low",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        },
    )

    result = json.loads(response.text)

    return {
        "explanation": result.get("explanation", ""),
        "root_cause": result.get("root_cause", ""),
        "fixed_code": result.get("fixed_code", ""),
        "confidence": result.get("confidence", "Medium"),
        "suggestions": result.get("suggestions", []),
    }
