from flask import Flask, jsonify, request
import logging
from datetime import datetime, timezone
from backend.config import Config
from backend.extensions import db, migrate

# Configure basic logging for the app
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

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

    # ---------------------------------------------
    # Health Check Route
    # ---------------------------------------------
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "up",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 200

    # ---------------------------------------------
    # Request Logging Middleware
    # ---------------------------------------------
    @app.before_request
    def log_request_info():
        logging.info(f"Incoming Request: {request.method} {request.url}")

    @app.after_request
    def log_response_info(response):
        logging.info(f"Outgoing Response: {response.status} for {request.method} {request.url}")
        return response

    # ---------------------------------------------
    # Centralized Error Handler
    # ---------------------------------------------
    @app.errorhandler(Exception)
    def handle_global_error(e):
        # We can log the full traceback here if needed
        logging.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "data": None,
            "error": "An unexpected error occurred on the server."
        }), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
