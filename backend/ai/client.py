import json
from .schema_validator import TaskGenerationResponseSchema

class GeminiClient:
    def generate_tasks(self, idea_title: str, idea_description: str) -> list[dict]:
        # This is a stub implementation.
        # In the future, this will call the actual Gemini API.
        
        # Simulated standard output that is strictly validated against the model
        mock_response = {
            "tasks": [
                {
                    "title": f"Research {idea_title}",
                    "description": f"Perform initial market research for: {idea_description}",
                    "acceptance_criteria": "A document summarizing research findings."
                },
                {
                    "title": f"Design Architecture for {idea_title}",
                    "description": "Outline the system architecture.",
                    "acceptance_criteria": "Architecture diagram approved."
                }
            ]
        }
        
        # Validate using Pydantic
        validated_data = TaskGenerationResponseSchema.model_validate(mock_response)
        return validated_data.model_dump()["tasks"]
