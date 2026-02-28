# Task AI Studio

> An AI-powered project management tool that turns your raw ideas into structured, actionable Kanban sprint plans — powered by Google Gemini.

---

## What is it?

Task AI Studio bridges the gap between "I have an idea" and "I have a sprint plan." You describe an application or project you want to build, and the AI breaks it down into a prioritized list of development tasks, complete with descriptions and acceptance criteria. You then manage those tasks visually on a drag-and-drop Kanban board.

---

## Features

### 🤖 AI-Powered Task Generation
Describe your idea in plain English. Gemini analyzes it and generates a structured set of tasks (with titles, descriptions, and acceptance criteria) ready to drop onto your board.

### 📋 Full Kanban Board
A four-column board: **Draft → Planned → In Progress → Done**. Move tasks by dragging and dropping — the backend enforces valid workflow transitions and rolls back illegal moves automatically.

### ✏️ Complete CRUD
- Create, edit, and delete **Ideas** from the sidebar.
- Create, edit, and delete **Tasks** directly on the board.
- Manually add tasks alongside AI-generated ones.

### 📜 Task History
Every status change is logged. Click a task to slide open its full transition history.

### 🔔 Smart Notifications
Context-aware toast messages for every action — including actionable error messages when a drag is rejected (e.g., *"Only valid next step: Draft → Planned"*).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, Flask, SQLAlchemy, Pydantic v2 |
| **Database** | SQLite (development) |
| **AI** | Google Gemini (`gemini-2.0-flash`) |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Drag-and-Drop** | `@hello-pangea/dnd` |
| **Routing** | React Router v6 |

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/retr0nade/Task_AI_Studio.git
cd Task_AI_Studio
```

### 2. Backend setup
```bash
# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
source venv/bin/activate      # macOS / Linux

# Install dependencies
pip install -r backend/requirements.txt

# Set your Gemini API key
$env:GEMINI_API_KEY="your-api-key-here"   # Windows PowerShell
export GEMINI_API_KEY="your-api-key-here"  # macOS / Linux

# Run database migrations
flask --app backend.app db upgrade

# Start the backend
python -m backend.app
```
The API will be available at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## Project Structure

```
Task_AI_Studio/
├── backend/
│   ├── ai/               # Gemini client & prompt logic
│   ├── domain/           # State machine & business rules
│   ├── models/           # SQLAlchemy models (Idea, Task, TaskHistory)
│   ├── repositories/     # Database access layer
│   ├── routes/           # Flask REST API endpoints
│   ├── services/         # Business logic layer
│   └── app.py            # Application factory
│
├── frontend/
│   └── src/
│       ├── api/          # Typed fetch wrapper
│       ├── components/   # Kanban board, modals, toasts, layout
│       ├── hooks/        # useIdeas, useTasks custom hooks
│       ├── pages/        # Ideas page, Idea detail page
│       └── types/        # TypeScript interfaces
│
└── test_e2e.py           # Full end-to-end API test suite
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ideas` | List all ideas |
| `POST` | `/api/ideas` | Create a new idea |
| `PATCH` | `/api/ideas/<id>` | Update idea title/description |
| `DELETE` | `/api/ideas/<id>` | Delete idea and all its tasks |
| `POST` | `/api/ideas/<id>/generate-tasks` | Generate tasks with AI |
| `GET` | `/api/tasks/idea/<id>` | Get all tasks for an idea |
| `POST` | `/api/tasks` | Create a manual task |
| `PUT` | `/api/tasks/<id>` | Edit a task |
| `DELETE` | `/api/tasks/<id>` | Delete a task |
| `PATCH` | `/api/tasks/<id>/transition` | Move task to next status |
| `GET` | `/api/tasks/<id>/history` | Get task transition history |

---

## Running Tests

With the backend running, execute the end-to-end test suite:

```bash
python test_e2e.py
```

This validates idea creation, AI task generation, manual task creation, state machine transitions, CRUD operations, and cascade deletes.

---

## Roadmap

- [ ] User authentication (JWT / OAuth)
- [ ] PostgreSQL support for production deployments
- [ ] Task due dates and priority levels
- [ ] Progress summary per Idea in sidebar
- [ ] Docker + deployment configuration
- [ ] Dark mode

---

## License

MIT — see [`LICENSE.txt`](LICENSE.txt) for details.
