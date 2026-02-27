from flask import Blueprint, request, jsonify
from backend.repositories.idea_repository import IdeaRepository
from backend.services.idea_service import IdeaService
from backend.services.ai_service import AIService
from backend.ai.client import GeminiClient
from backend.repositories.task_repository import TaskRepository

from backend.services.task_service import TaskService

bp = Blueprint('ideas', __name__, url_prefix='/ideas')

idea_repo = IdeaRepository()
task_repo = TaskRepository()
task_service = TaskService(task_repo)
idea_service = IdeaService(idea_repo)
ai_client = GeminiClient()
ai_service = AIService(ai_client, task_service)

@bp.route('', methods=['POST'])
def create_idea():
    data = request.json
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'title and description are required'}), 400
        
    idea = idea_service.create_idea(data['title'], data['description'])
    
    # Auto-generate tasks
    tasks = ai_service.generate_tasks_for_idea(idea)
    
    return jsonify({
        'idea_id': idea.id,
        'title': idea.title,
        'description': idea.description,
        'status': idea.status,
        'tasks_generated': len(tasks)
    }), 201

@bp.route('/<int:idea_id>', methods=['GET'])
def get_idea(idea_id):
    idea = idea_service.get_idea(idea_id)
    if not idea:
        return jsonify({'error': 'Idea not found'}), 404
        
    return jsonify({
        'id': idea.id,
        'title': idea.title,
        'description': idea.description,
        'status': idea.status,
        'created_at': idea.created_at.isoformat() if idea.created_at else None
    }), 200
