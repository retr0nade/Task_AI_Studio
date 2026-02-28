from backend.models.idea import Idea
from backend.extensions import db

class IdeaRepository:
    def create(self, idea: Idea) -> Idea:
        db.session.add(idea)
        db.session.commit()
        return idea

    def get_by_id(self, idea_id: int) -> Idea | None:
        return db.session.get(Idea, idea_id)

    def list_all(self) -> list[Idea]:
        return db.session.query(Idea).order_by(Idea.created_at.desc()).all()

    def update(self, idea: Idea) -> Idea:
        db.session.commit()
        return idea

    def delete(self, idea: Idea) -> None:
        db.session.delete(idea)
        db.session.commit()
