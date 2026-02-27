from backend.extensions import db
from backend.utils.datetime_utils import utc_now

class Idea(db.Model):
    __tablename__ = 'ideas'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='draft')  # draft, planned, archived
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    tasks = db.relationship('Task', back_populates='idea', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Idea {self.id}: {self.title}>"
