from flask import Blueprint, request, jsonify, current_app
from pydantic import BaseModel, ValidationError
from backend.domain.exceptions import DomainException

bp = Blueprint('tasks', __name__, url_prefix='/tasks')

class CreateTaskRequest(BaseModel):
    idea_id: int
    title: str
    description: str
    acceptance_criteria: str | None = None
    
class UpdateTaskRequest(BaseModel):
    title: str
    description: str
    acceptance_criteria: str | None = None

class TransitionTaskRequest(BaseModel):
    status: str
    note: str | None = None

def success_response(data, status_code=200):
    return jsonify({"success": True, "data": data, "error": None}), status_code

def error_response(message, status_code):
    return jsonify({"success": False, "data": None, "error": message}), status_code


@bp.route('', methods=['POST'])
def create_task():
    try:
        data = request.json or {}
        req = CreateTaskRequest(**data)
    except ValidationError as e:
        return error_response(f"Validation Error: {e.errors()}", 400)
        
    task_service = current_app.container['task_service']
    try:
        task = task_service.create_task(
            idea_id=req.idea_id,
            title=req.title,
            description=req.description,
            acceptance_criteria=req.acceptance_criteria,
            is_ai_generated=False
        )
        return success_response({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status
        }, 201)
    except Exception as e:
        return error_response(str(e), 500)


@bp.route('/idea/<int:idea_id>', methods=['GET'])
def get_tasks_for_idea(idea_id):
    task_service = current_app.container['task_service']
    try:
        tasks = task_service.get_tasks_for_idea(idea_id)
        return success_response([{
            'id': t.id,
            'idea_id': t.idea_id,
            'title': t.title,
            'status': t.status,
            'description': t.description,
            'acceptance_criteria': t.acceptance_criteria,
            'is_ai_generated': t.is_ai_generated,
            'created_at': t.created_at.isoformat() if t.created_at else None
        } for t in tasks], 200)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json or {}
        req = UpdateTaskRequest(**data)
    except ValidationError as e:
        return error_response(f"Validation Error: {e.errors()}", 400)
        
    task_service = current_app.container['task_service']
    try:
        task = task_service.update_task(
            task_id=task_id,
            title=req.title,
            description=req.description,
            acceptance_criteria=req.acceptance_criteria
        )
        return success_response({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status
        }, 200)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task_service = current_app.container['task_service']
    try:
        task_service.delete_task(task_id)
        return success_response(None, 204)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:task_id>/history', methods=['GET'])
def get_task_history(task_id):
    task_service = current_app.container['task_service']
    try:
        history = task_service.get_task_history(task_id)
        return success_response([{
            'id': h.id,
            'task_id': h.task_id,
            'from_status': h.from_status,
            'to_status': h.to_status,
            'note': h.note,
            'changed_at': h.changed_at.isoformat() if h.changed_at else None
        } for h in history], 200)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route('/<int:task_id>/transition', methods=['PATCH'])
def update_task_status(task_id):
    try:
        data = request.json or {}
        req = TransitionTaskRequest(**data)
    except ValidationError as e:
        return error_response(f"Validation Error: {e.errors()}", 400)
        
    task_service = current_app.container['task_service']
    try:
        history = task_service.transition_task(task_id, req.status, req.note)
        return success_response({
            'task_id': history.task_id,
            'from_status': history.from_status,
            'to_status': history.to_status
        }, 200)
    except DomainException as e:
        return error_response(str(e), 409)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)
