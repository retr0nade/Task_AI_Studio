from backend.models.idea import Idea
from backend.repositories.idea_repository import IdeaRepository

class IdeaService:
    def __init__(self, idea_repository: IdeaRepository):
        self.repository = idea_repository

    def create_idea(self, title: str, description: str) -> Idea:
        idea = Idea(title=title, description=description)
        return self.repository.create(idea)

    def get_idea(self, idea_id: int) -> Idea | None:
        return self.repository.get_by_id(idea_id)

    def list_ideas(self) -> list[Idea]:
        return self.repository.list_all()

    def update_idea(self, idea_id: int, title: str, description: str) -> Idea:
        idea = self.repository.get_by_id(idea_id)
        if not idea:
            raise ValueError(f"Idea {idea_id} not found")
        
        idea.title = title
        idea.description = description
        return self.repository.update(idea)

    def delete_idea(self, idea_id: int) -> None:
        idea = self.repository.get_by_id(idea_id)
        if not idea:
            raise ValueError(f"Idea {idea_id} not found")
            
        self.repository.delete(idea)
