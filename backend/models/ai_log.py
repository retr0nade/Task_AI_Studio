from datetime import datetime, timezone
from backend.extensions import db

class AILog(db.Model):
    __tablename__ = 'ai_logs'

    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('ideas.id'), nullable=True, index=True)
    endpoint = db.Column(db.String(100), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    raw_response = db.Column(db.Text, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    idea = db.relationship('Idea', backref=db.backref('ai_logs', lazy=True, cascade="all, delete-orphan"))

    def __repr__(self):
        return f'<AILog {self.id} for Idea {self.idea_id}>'
