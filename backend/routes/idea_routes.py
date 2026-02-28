from flask import Blueprint, request, jsonify, current_app
from pydantic import BaseModel, ValidationError
from backend.domain.exceptions import AIValidationException

bp = Blueprint('ideas', __name__, url_prefix='/ideas')

class CreateIdeaRequest(BaseModel):
    title: str
    description: str

class UpdateIdeaRequest(BaseModel):
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
        
    idea_service = current_app.container['idea_service']
    ai_service = current_app.container['ai_service']
        
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
    idea_service = current_app.container['idea_service']
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
    idea_service = current_app.container['idea_service']
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

@bp.route('/<int:idea_id>', methods=['PATCH'])
def update_idea(idea_id):
    try:
        data = request.json or {}
        req = UpdateIdeaRequest(**data)
    except ValidationError as e:
        return error_response(f"Validation Error: {e.errors()}", 400)
        
    idea_service = current_app.container['idea_service']
    try:
        idea = idea_service.update_idea(idea_id, req.title, req.description)
        return success_response({
            'id': idea.id,
            'title': idea.title,
            'description': idea.description,
            'status': idea.status,
            'created_at': idea.created_at.isoformat() if idea.created_at else None
        }, 200)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:idea_id>', methods=['DELETE'])
def delete_idea(idea_id):
    idea_service = current_app.container['idea_service']
    try:
        idea_service.delete_idea(idea_id)
        return success_response(None, 204)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:idea_id>/generate-tasks', methods=['POST'])
def generate_tasks(idea_id):
    idea_service = current_app.container['idea_service']
    ai_service = current_app.container['ai_service']
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
