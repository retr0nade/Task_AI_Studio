from flask import Blueprint, request, jsonify
from backend.repositories.task_repository import TaskRepository
from backend.services.task_service import TaskService
from backend.domain.exceptions import DomainException

bp = Blueprint('tasks', __name__, url_prefix='/tasks')

task_repo = TaskRepository()
task_service = TaskService(task_repo)

@bp.route('/idea/<int:idea_id>', methods=['GET'])
def get_tasks_for_idea(idea_id):
    tasks = task_service.get_tasks_for_idea(idea_id)
    return jsonify([{
        'id': t.id,
        'idea_id': t.idea_id,
        'title': t.title,
        'status': t.status,
        'description': t.description,
        'acceptance_criteria': t.acceptance_criteria,
        'is_ai_generated': t.is_ai_generated,
        'created_at': t.created_at.isoformat() if t.created_at else None
    } for t in tasks]), 200

@bp.route('/<int:task_id>/status', methods=['PATCH'])
def update_task_status(task_id):
    data = request.json
    new_status = data.get('status')
    note = data.get('note')
    
    if not new_status:
        return jsonify({'error': 'status is required'}), 400
        
    try:
        history = task_service.transition_task(task_id, new_status, note)
        return jsonify({
            'message': 'Status updated successfully',
            'task_id': history.task_id,
            'from_status': history.from_status,
            'to_status': history.to_status
        }), 200
    except DomainException as e:
        return jsonify({'error': str(e)}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
