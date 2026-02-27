from flask import Flask
from backend.config import Config
from backend.extensions import db, migrate

# Import Repositories
from backend.repositories.idea_repository import IdeaRepository
from backend.repositories.task_repository import TaskRepository

# Import Services
from backend.services.idea_service import IdeaService
from backend.services.task_service import TaskService
from backend.services.ai_service import AIService
from backend.ai.client import GeminiClient

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Dependency Injection Container setup
    with app.app_context():
        idea_repo = IdeaRepository()
        task_repo = TaskRepository()
        
        task_service = TaskService(task_repo)
        idea_service = IdeaService(idea_repo)
        
        ai_client = GeminiClient()
        ai_service = AIService(ai_client, task_service)
        
        # Attach to app container so blueprints can access dynamically
        app.container = {
            'idea_service': idea_service,
            'task_service': task_service,
            'ai_service': ai_service
        }

    # Register blueprints
    from backend.routes.idea_routes import bp as idea_bp
    from backend.routes.task_routes import bp as task_bp
    app.register_blueprint(idea_bp)
    app.register_blueprint(task_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
