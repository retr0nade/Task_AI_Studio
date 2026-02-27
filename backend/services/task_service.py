from backend.models.task import Task
from backend.models.task_history import TaskHistory
from backend.repositories.task_repository import TaskRepository
from backend.domain.state_machine import validate_task_transition

class TaskService:
    def __init__(self, task_repository: TaskRepository):
        self.repository = task_repository

    def get_tasks_for_idea(self, idea_id: int) -> list[Task]:
        return self.repository.get_by_idea_id(idea_id)

    def get_task(self, task_id: int) -> Task | None:
        return self.repository.get_by_id(task_id)

    def change_task_status(self, task_id: int, new_status: str, note: str = None) -> TaskHistory:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")

        # Validate domain rules
        validate_task_transition(task, new_status)

        # Create history record
        history = TaskHistory(
            task_id=task.id,
            from_status=task.status,
            to_status=new_status,
            note=note
        )
        task.status = new_status
        self.repository.save_transition(task, history)
        return history

    def update_task_details(self, task_id: int, title: str = None, description: str = None, acceptance_criteria: str = None) -> Task:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if acceptance_criteria is not None:
            task.acceptance_criteria = acceptance_criteria
            
        self.repository.create(task)  # saving changes using create() in repository
        return task
