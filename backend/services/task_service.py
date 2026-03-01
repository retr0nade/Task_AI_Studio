from backend.models.task import Task
from backend.models.task_history import TaskHistory
from backend.repositories.task_repository import TaskRepository
from backend.domain.state_machine import validate_task_transition
from backend.extensions import db

class TaskService:
    def __init__(self, task_repository: TaskRepository):
        self.repository = task_repository

    def create_task(self, idea_id: int, title: str, description: str, acceptance_criteria: str = None, is_ai_generated: bool = False) -> Task:
        task = Task(
            idea_id=idea_id,
            title=title,
            description=description,
            acceptance_criteria=acceptance_criteria,
            status='draft',
            is_ai_generated=is_ai_generated
        )
        return self.repository.create(task)

    def transition_task(self, task_id: int, new_status: str, note: str = None) -> TaskHistory:
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

    def regenerate_ai_tasks(self, idea_id: int, generated_tasks: list[dict]) -> list[Task]:
        """
        Deletes existing AI-generated tasks for an idea and creates new ones from the AI output.
        Wraps in a single transaction.
        """
        existing_tasks = self.repository.get_by_idea_id(idea_id)
        
        try:
            # Delete old AI tasks
            for task in existing_tasks:
                if task.is_ai_generated:
                    db.session.delete(task)
            
            # Create new ones
            new_tasks = []
            for t_data in generated_tasks:
                task = Task(
                    idea_id=idea_id,
                    title=t_data['title'],
                    description=t_data['description'],
                    acceptance_criteria=t_data.get('acceptance_criteria'),
                    status='draft',
                    is_ai_generated=True
                )
                db.session.add(task)
                new_tasks.append(task)
                
            db.session.commit()
            return self.repository.get_by_idea_id(idea_id)
        except Exception as e:
            db.session.rollback()
            raise e

    def get_tasks_for_idea(self, idea_id: int) -> list[Task]:
        return self.repository.get_by_idea_id(idea_id)

    def get_task(self, task_id: int) -> Task | None:
        return self.repository.get_by_id(task_id)

    def update_task(self, task_id: int, title: str, description: str, acceptance_criteria: str = None) -> Task:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        task.title = title
        task.description = description
        task.acceptance_criteria = acceptance_criteria
        # Optional: You could log a history entry for updates, but for MVP updating fields directly is fine.
        
        return self.repository.update(task)

    def delete_task(self, task_id: int) -> None:
        task = self.repository.get_by_id(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        self.repository.delete(task)

    def get_task_history(self, task_id: int) -> list[TaskHistory]:
        return self.repository.get_history_by_task_id(task_id)
