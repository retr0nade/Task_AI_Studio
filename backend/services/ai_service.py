from backend.ai.client import GeminiClient
from backend.models.idea import Idea
from backend.models.task import Task
from backend.repositories.task_repository import TaskRepository

class AIService:
    def __init__(self, ai_client: GeminiClient, task_repository: TaskRepository):
        self.ai_client = ai_client
        self.task_repo = task_repository

    def generate_tasks_for_idea(self, idea: Idea) -> list[Task]:
        # Generate raw task data from AI
        raw_tasks = self.ai_client.generate_tasks(idea.title, idea.description)
        
        # Create Task models
        new_tasks = []
        for t_data in raw_tasks:
            task = Task(
                idea_id=idea.id,
                title=t_data['title'],
                description=t_data['description'],
                acceptance_criteria=t_data.get('acceptance_criteria'),
                status='draft',
                is_ai_generated=True
            )
            new_tasks.append(task)
            
        # Save to DB
        return self.task_repo.create_many(new_tasks)
