from backend.models.task import Task
from backend.models.task_history import TaskHistory
from backend.extensions import db

class TaskRepository:
    def create(self, task: Task) -> Task:
        db.session.add(task)
        db.session.commit()
        return task

    def create_many(self, tasks: list[Task]) -> list[Task]:
        db.session.add_all(tasks)
        db.session.commit()
        return tasks

    def get_by_id(self, task_id: int) -> Task | None:
        return db.session.get(Task, task_id)

    def get_by_idea_id(self, idea_id: int) -> list[Task]:
        return db.session.query(Task).filter(Task.idea_id == idea_id).order_by(Task.created_at.asc()).all()

    def save_transition(self, task: Task, history: TaskHistory):
        db.session.add(history)
        db.session.commit()
        
    def delete(self, task: Task):
        db.session.delete(task)
        db.session.commit()
