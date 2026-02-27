from .exceptions import InvalidTransitionError, MissingAcceptanceCriteriaError

VALID_TRANSITIONS = {
    'draft': ['planned'],
    'planned': ['draft', 'in_progress'],
    'in_progress': ['planned', 'done'],
    'done': ['in_progress']
}

def validate_task_transition(task, new_status: str):
    current_status = task.status
    if current_status == new_status:
        return

    # Check valid transition path
    allowed_next = VALID_TRANSITIONS.get(current_status, [])
    if new_status not in allowed_next:
        raise InvalidTransitionError(f"Cannot transition task from {current_status} to {new_status}")

    # Domain rule: Cannot mark done without acceptance criteria
    if new_status == 'done':
        if not task.acceptance_criteria or not task.acceptance_criteria.strip():
            raise MissingAcceptanceCriteriaError("Task cannot be marked as done without acceptance criteria.")
