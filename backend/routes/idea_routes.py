from flask import Blueprint, request, jsonify
from pydantic import BaseModel, ValidationError
from backend.repositories.idea_repository import IdeaRepository
from backend.services.idea_service import IdeaService
from backend.services.ai_service import AIService
from backend.ai.client import GeminiClient
from backend.repositories.task_repository import TaskRepository
from backend.services.task_service import TaskService
from backend.domain.exceptions import AIValidationException

bp = Blueprint('ideas', __name__, url_prefix='/ideas')

idea_repo = IdeaRepository()
task_repo = TaskRepository()
task_service = TaskService(task_repo)
idea_service = IdeaService(idea_repo)
ai_client = GeminiClient()
ai_service = AIService(ai_client, task_service)

class CreateIdeaRequest(BaseModel):
    title: str
    description: str

def success_response(data, status_code=200):
    return jsonify({"success": True, "data": data, "error": None}), status_code

def error_response(message, status_code):
    return jsonify({"success": False, "data": None, "error": message}), status_code


@bp.route('', methods=['POST'])
def create_idea():
    try:
        data = request.json or {}
        req = CreateIdeaRequest(**data)
    except ValidationError as e:
        return error_response(f"Validation Error: {e.errors()}", 400)
        
    try:
        idea = idea_service.create_idea(req.title, req.description)
        return success_response({
            'id': idea.id,
            'title': idea.title,
            'description': idea.description,
            'status': idea.status
        }, 201)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('', methods=['GET'])
def list_ideas():
    try:
        ideas = idea_service.list_ideas()
        return success_response([{
            'id': i.id,
            'title': i.title,
            'description': i.description,
            'status': i.status,
            'created_at': i.created_at.isoformat() if i.created_at else None
        } for i in ideas], 200)
    except Exception as e:
        return error_response(str(e), 500)


@bp.route('/<int:idea_id>', methods=['GET'])
def get_idea(idea_id):
    try:
        idea = idea_service.get_idea(idea_id)
        if not idea:
            return error_response('Idea not found', 404)
            
        return success_response({
            'id': idea.id,
            'title': idea.title,
            'description': idea.description,
            'status': idea.status,
            'created_at': idea.created_at.isoformat() if idea.created_at else None
        }, 200)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:idea_id>/generate-tasks', methods=['POST'])
def generate_tasks(idea_id):
    try:
        idea = idea_service.get_idea(idea_id)
        if not idea:
            return error_response('Idea not found', 404)
            
        tasks = ai_service.generate_tasks_for_idea(idea)
        
        return success_response([{
             'id': t.id,
             'title': t.title,
             'description': t.description,
             'status': t.status,
             'acceptance_criteria': t.acceptance_criteria,
             'is_ai_generated': t.is_ai_generated
        } for t in tasks], 201)
    except AIValidationException as e:
        return error_response(f"AI generation failed: {str(e)}", 502)
    except Exception as e:
        return error_response(str(e), 500)
