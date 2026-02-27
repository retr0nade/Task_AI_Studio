from backend.extensions import db
from backend.utils.datetime_utils import utc_now

class TaskHistory(db.Model):
    __tablename__ = 'task_history'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False, index=True)
    from_status = db.Column(db.String(50), nullable=True)
    to_status = db.Column(db.String(50), nullable=False)
    changed_at = db.Column(db.DateTime, default=utc_now)
    note = db.Column(db.Text, nullable=True)

    # Relationships
    task = db.relationship('Task', back_populates='history')

    def __repr__(self):
        return f"<TaskHistory {self.id}: {self.from_status} -> {self.to_status}>"
