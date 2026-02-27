import json
import re
from backend.domain.exceptions import AIValidationException

def validate_ai_task_response(raw_response: str) -> dict:
    # Strip markdown formatting like ```json ... ``` or just ``` ... ```
    cleaned_response = raw_response.strip()
    match = re.search(r"```(?:json)?(.*?)```", cleaned_response, re.DOTALL)
    if match:
        cleaned_response = match.group(1).strip()
        
    try:
        data = json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        raise AIValidationException(f"Invalid JSON format: {str(e)}")
        
    if not isinstance(data, dict):
        raise AIValidationException("Root JSON element must be an object (dict)")
        
    if "tasks" not in data:
        raise AIValidationException("Missing required top-level key: 'tasks'")
        
    tasks = data["tasks"]
    if not isinstance(tasks, list):
        raise AIValidationException("'tasks' must be a list")
        
    if not (1 <= len(tasks) <= 10):
        raise AIValidationException(f"Task count must be between 1 and 10, got {len(tasks)}")
        
    valid_keys = {"title", "description", "acceptance_criteria"}
    
    for idx, t in enumerate(tasks):
        if not isinstance(t, dict):
            raise AIValidationException(f"Task at index {idx} must be an object")
            
        keys = set(t.keys())
        if keys != valid_keys:
            raise AIValidationException(f"Task at index {idx} has invalid keys. Expected {valid_keys}, got {keys}")
            
        for key in valid_keys:
            val = t[key]
            if not isinstance(val, str):
                raise AIValidationException(f"Task at index {idx}, key '{key}' must be a string")
            if not val.strip():
                raise AIValidationException(f"Task at index {idx}, key '{key}' cannot be empty")
                
    return data
