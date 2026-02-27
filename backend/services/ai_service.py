import logging
from datetime import datetime, timezone
from backend.ai.client import GeminiClient
from backend.ai.schema_validator import validate_ai_task_response
from backend.models.idea import Idea
from backend.models.task import Task
from backend.services.task_service import TaskService
from backend.domain.exceptions import AIValidationException

class AIService:
    def __init__(self, ai_client: GeminiClient, task_service: TaskService):
        self.ai_client = ai_client
        self.task_service = task_service

    def generate_tasks_for_idea(self, idea: Idea) -> list[Task]:
        attempts = 0
        max_attempts = 2
        last_exception = None
        
        while attempts < max_attempts:
            attempts += 1
            try:
                # 1. Call generate_tasks_from_idea()
                raw_response = self.ai_client.generate_tasks_from_idea(idea.title, idea.description)
                
                # 2. Validate using schema_validator
                validated_data = validate_ai_task_response(raw_response)
                
                # Success. Log the execution.
                logging.info(f"AI task generation succeeded for idea {idea.id}")
                
                # 3. Return structured tasks to TaskService
                return self.task_service.regenerate_ai_tasks(idea.id, validated_data["tasks"])
                
            except AIValidationException as e:
                # We catch only AIValidationException to trigger retries. 
                # API failures (like networking or quota errors) will bubble up.
                logging.warning(
                    f"[Attempt {attempts}] AI validation failed.\n"
                    f"Model: {self.ai_client.model_name}\n"
                    f"Timestamp: {datetime.now(timezone.utc).isoformat()}\n"
                    f"Error: {str(e)}\n"
                    f"Raw Response:\n{raw_response}"
                )
                last_exception = e
                
        # If second attempt fails: Raise exception
        raise last_exception
