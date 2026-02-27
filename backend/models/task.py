from backend.extensions import db
from backend.utils.datetime_utils import utc_now

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('ideas.id'), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    acceptance_criteria = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='draft')  # draft, planned, in_progress, done
    is_ai_generated = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    idea = db.relationship('Idea', back_populates='tasks')
    history = db.relationship('TaskHistory', back_populates='task', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Task {self.id}: {self.title}>"
