import os
import google.generativeai as genai
import logging

class GeminiClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
            
        genai.configure(api_key=api_key)
        self.model_name = "gemini-1.5-flash"
        self.model = genai.GenerativeModel(self.model_name)
        
    def generate_tasks_from_idea(self, title: str, description: str) -> str:
        prompt = f"""You are a product planning assistant.

Given:
Title: {title}
Description: {description}

Generate 3 to 6 implementation tasks.

Return STRICT JSON ONLY in this exact format:

{{
"tasks": [
{{
"title": "...",
"description": "...",
"acceptance_criteria": "..."
}}
]
}}

Rules:
Do not include markdown
Do not include explanation
Do not include code blocks
Do not include extra keys
All values must be strings
Output must start with {{ and end with }}
If you output anything else, it will be rejected.
"""
        
        # Low temperature for concise, predictable output
        config = genai.types.GenerationConfig(
            temperature=0.2
        )
        
        logging.info(f"Using model: {self.model_name} for task generation")
        response = self.model.generate_content(prompt, generation_config=config)
        
        return response.text
