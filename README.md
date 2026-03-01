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

Context-aware toast messages for every action — including actionable error messages when a drag is rejected (e.g., _"Only valid next step: Draft → Planned"_).

---

## Architecture Overview

The system is a decoupled full-stack application.

The backend is built with Flask and follows a clean layered architecture using an application factory pattern. The layers are structured as follows:

- **Routes**: Handle HTTP and request validation only.
- **Services**: Contain business logic and orchestration.
- **Domain**: Enforces invariants, including the task state machine.
- **Repositories**: Isolate database access.
- **Models**: Define relational structure using SQLAlchemy.
- **AI Layer**: Completely isolated from persistence logic.

This separation ensures that changes in one layer do not cascade unpredictably into others, which supports maintainability and change resilience.

On the frontend, React with TypeScript provides strong type safety. All API responses follow a consistent structure, and strict TypeScript interfaces mirror backend models to enforce interface safety.

### Domain Logic & Correctness

The Kanban workflow is governed by an explicit state machine in the domain layer. The allowed transitions are:

- Draft → Planned
- Planned → In Progress
- In Progress → Done
- Done → Planned

Invalid transitions return a `409 Conflict` response. Additionally, a task cannot move to Done unless it has acceptance criteria defined. This rule is enforced server-side, not in the frontend, ensuring correctness regardless of client behavior. Every valid transition generates a `TaskHistory` record, creating an immutable audit trail. The frontend cannot bypass these rules — even if an invalid drag-and-drop occurs, the backend rejects it and the UI rolls back the state, guaranteeing predictable system behavior.

### AI Integration & Interface Safety

AI integration is treated carefully, with AI output considered untrusted input. When Gemini returns a response, it must match a strict JSON schema:

- It must contain a `"tasks"` array.
- Each task must have exactly the required keys.
- All fields must be strings.
- No extra keys are allowed.
- The number of tasks must be within bounds.

If the response is malformed, the system retries once. If it fails again, the API returns a `502 Bad Gateway` response, clearly indicating an upstream AI issue. The AI layer does not access the database directly; it only generates content while the service layer handles validation and persistence. This ensures interface safety and protects system integrity from unpredictable model behavior.

### AI Guidance & Prompting Approach

AI was utilized strictly as an acceleration tool. To ensure reliable and high-quality results:

- **Explicit Prompting**: AI output was constrained via explicit and structured prompting.
- **Strict Schema Validation**: All AI output was validated against a strict JSON schema.
- **Manual Review**: All generated code was manually reviewed before integration.
- **No Blind Trust**: AI output was never blindly trusted; it was treated as untrusted input.
- **Failure Handling**: Retry logic and failure handling mechanisms were added to manage any anomalies.

This approach satisfies the requirement of maintaining full developer control while leveraging AI for speed.

### Change Resilience & Regeneration Safety

When regenerating tasks for an idea, only AI-generated tasks are replaced. Manually created tasks are preserved. This design ensures that user edits are never overwritten by AI. Business logic is isolated within the service layer, so adding new features does not require modifying unrelated components. This demonstrates change resilience — the system can evolve without destabilizing existing behavior.

### Verification & Observability

An automated end-to-end Python test suite verifies:

- Idea creation and deletion
- AI task generation
- Valid transitions
- Invalid transitions returning `409 Conflict`
- Regeneration safety
- Correct HTTP status codes

All API responses follow a unified structure, and centralized error handling ensures failures are visible and diagnosable. This improves system observability and reliability.

### Tradeoffs & Design Decisions

- SQLite was chosen for development simplicity and reproducibility. The repository abstraction makes migrating to PostgreSQL straightforward.
- Authentication was omitted to focus on architectural clarity and correctness rather than SaaS readiness.
- Simple, readable code was prioritized over clever abstractions to maintain predictability.

### Risks & Extensions

Current limitations include SQLite's concurrency constraints and reliance on AI availability. Future extensions could include user authentication, PostgreSQL migration, prioritization, and multi-user support. The architecture is structured to support these additions without widespread refactoring.

---

## Tech Stack

| Layer             | Technology                                  |
| ----------------- | ------------------------------------------- |
| **Backend**       | Python 3.12, Flask, SQLAlchemy, Pydantic v2 |
| **Database**      | SQLite (development)                        |
| **AI**            | Google Gemini (`gemini-2.0-flash`)          |
| **Frontend**      | React 18, TypeScript, Vite, Tailwind CSS    |
| **Drag-and-Drop** | `@hello-pangea/dnd`                         |
| **Routing**       | React Router v6                             |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone -b submission-final https://github.com/retr0nade/Task_AI_Studio.git
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

# Configure your Gemini API key (create the .env file)
# Windows (PowerShell):
Set-Content -Path backend\.env -Value "GEMINI_API_KEY=your-api-key-here" -Encoding utf8NoBOM

# macOS / Linux (bash/zsh):
echo "GEMINI_API_KEY=your-api-key-here" > backend/.env

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

| Method   | Endpoint                         | Description                   |
| -------- | -------------------------------- | ----------------------------- |
| `GET`    | `/api/ideas`                     | List all ideas                |
| `POST`   | `/api/ideas`                     | Create a new idea             |
| `PATCH`  | `/api/ideas/<id>`                | Update idea title/description |
| `DELETE` | `/api/ideas/<id>`                | Delete idea and all its tasks |
| `POST`   | `/api/ideas/<id>/generate-tasks` | Generate tasks with AI        |
| `GET`    | `/api/tasks/idea/<id>`           | Get all tasks for an idea     |
| `POST`   | `/api/tasks`                     | Create a manual task          |
| `PUT`    | `/api/tasks/<id>`                | Edit a task                   |
| `DELETE` | `/api/tasks/<id>`                | Delete a task                 |
| `PATCH`  | `/api/tasks/<id>/transition`     | Move task to next status      |
| `GET`    | `/api/tasks/<id>/history`        | Get task transition history   |

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
