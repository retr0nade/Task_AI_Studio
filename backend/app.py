from flask import Flask
from backend.config import Config
from backend.extensions import db, migrate

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from backend.routes.idea_routes import bp as idea_bp
    from backend.routes.task_routes import bp as task_bp
    app.register_blueprint(idea_bp)
    app.register_blueprint(task_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
