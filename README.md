# EHS Incident Prevention Assistant

A production-ready EHS safety intelligence platform for helping field workers, SMEs, and admins turn documents, incidents, expert knowledge, and voice notes into trusted safety guidance.

This system is not just a document chatbot. It is designed to help industrial teams prevent repeated incidents, preserve field expertise, review safety knowledge through SMEs, and deliver structured safety answers with citations.

## What This Project Solves

Industrial safety teams often rely on scattered SOPs, manuals, incident reports, tribal knowledge, and field experience. This creates a real risk:

- field workers may not find the right procedure in time
- old documents can conflict with updated safety rules
- expert knowledge stays locked in people’s heads
- repeated incidents happen because lessons learned are not reused
- AI answers may be unsafe if they are not grounded and reviewed

This project solves that by creating a structured EHS knowledge platform where:

- admins manage sites, users, and documents
- SMEs review and approve safety knowledge
- field workers ask safety questions and record field observations
- uploaded documents are processed into searchable knowledge
- voice notes can become structured knowledge objects
- AI answers are generated only from trusted, filtered safety data
- conflicts are detected before unsafe guidance reaches workers

## Core Features

- Tenant-based company isolation
- Site management
- Role-based access for Admin, SME, and Field Worker
- Document upload and processing
- MinIO-backed file storage
- PostgreSQL + pgvector semantic search
- Celery background workers
- Redis broker
- Voice note extraction into knowledge objects
- SME review workflow
- Conflict detection
- RAG-based safety assistant
- Structured Knowledge Cards
- Incident prevention briefings
- Audit-friendly architecture

## Tech Stack

### Backend

- **FastAPI** — API framework
- **SQLAlchemy 2** — async ORM
- **Alembic** — database migrations
- **PostgreSQL** — primary relational database
- **pgvector** — vector search for RAG
- **Pydantic / pydantic-settings** — validation and environment config
- **Uvicorn** — ASGI server

### Background Jobs

- **Celery** — async task processing
- **Redis** — Celery broker/result backend

### Storage

- **MinIO** — S3-compatible object storage for documents, images, audio files, and extracted assets

### AI / RAG Layer

- **LangChain** — RAG orchestration
- **Voyage AI** — embeddings
- **OpenRouter** — LLM access
- **Gemini Vision** — image understanding
- **Deepgram** — speech-to-text for voice notes

### Client

- **React**
- **TypeScript**
- **TanStack Router**
- **TanStack Query**
- **TanStack Table**
- **Shadcn/UI**
- **React Hook Form**
- **Zustand** where needed
- **Lucide React**

## Project Structure

```txt
project-root/
  server/
    app/
      api/              # Route handlers (feature-based)
      core/             # Config, environment, and app-wide setup
      db/               # Database engine, session, Base
      services/         # Feature services (business logic)
      alembic/          # Migrations and migration scripts
      seeders/          # Initial data/role/admin seeders

  client/
    src/
      features/         # Feature-first frontend modules
      components/       # Shared global UI components
      layout/           # Global layouts and shells
      services/         # API service layer
      types/            # Shared TypeScript interfaces
      hooks/            # Shared hooks
      routes/           # TanStack Router routes
```

## Backend Architecture

The backend follows a modular FastAPI architecture.

Each major domain has:

- route handlers
- schemas
- service logic
- database models
- validation rules

The API is designed around multi-tenant safety data. Most major records include tenant ownership and soft-delete support.

Core backend modules include:

- authentication
- users
- roles
- sites
- documents
- knowledge objects
- knowledge chunks
- incidents
- chat sessions
- citations
- reviews
- conflicts
- feedback
- audit logs

## Client Architecture

The frontend uses a feature-first architecture.

Primary business logic belongs inside:

```txt
client/src/features/{feature-name}/
```

Each feature should include:

```txt
index.tsx
components/
hooks/
```

Shared UI belongs in:

```txt
client/src/components/
```

API calls belong in:

```txt
client/src/services/
```

The client uses:

- TanStack Query for all server state
- TanStack Router for type-safe routing
- Shadcn/UI for primitives
- React Hook Form for forms
- DataTable + TanStack Table for list pages
- centralized cache keys
- toast feedback for mutations and user-visible errors

## Microservices

The project runs with several supporting services.

### PostgreSQL + pgvector

Used as the main database and vector store.

```yaml
db:
  image: pgvector/pgvector:pg17
  env_file:
    - .env
  environment:
    POSTGRES_USER: ${POSTGRESQL_USERNAME}
    POSTGRES_PASSWORD: ${POSTGRESQL_PASSWORD}
    POSTGRES_DB: ${POSTGRESQL_DATABASE}
  ports:
    - "${POSTGRESQL_PORT:-5433}:5432"
  volumes:
    - db-data:/var/lib/postgresql/data
  networks:
    - app-network
  healthcheck:
    test:
      [
        "CMD-SHELL",
        "pg_isready -U ${POSTGRESQL_USERNAME} -d ${POSTGRESQL_DATABASE}",
      ]
    interval: 5s
    timeout: 5s
    retries: 5
```

### Redis

Used by Celery as the broker/result backend.

```yaml
redis:
  image: redis:latest
  container_name: redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  networks:
    - app-network
  volumes:
    - redis-data:/data
```

### MinIO

Used for uploaded documents, images, audio recordings, reports, and extracted files.

```yaml
minio:
  image: quay.io/minio/minio
  container_name: minio
  restart: unless-stopped
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: ${MINIO_ROOT_USER}
    MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
  volumes:
    - ./minio-data:/data
  command: server /data --console-address ":9001"
```

MinIO services:

- S3 API: `http://localhost:9000`
- Console: `http://localhost:9001`

### MailHog

Used for local SMTP testing.

```yaml
smtp:
  image: mailhog/mailhog:latest
  container_name: smtp
  restart: always
  ports:
    - "1025:1025"
    - "8025:8025"
  networks:
    - app-network
```

MailHog UI:

```txt
http://localhost:8025
```

## Docker Volumes and Network

```yaml
volumes:
  db-data:
  minio-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

## Environment Setup

Create a `.env` file from the example file:

```bash
cp .env.example .env
```

Update the required values.

Common variables include:

```env
POSTGRESQL_USERNAME=
POSTGRESQL_PASSWORD=
POSTGRESQL_DATABASE=
POSTGRESQL_PORT=

MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=

REDIS_HOST=
REDIS_PORT=

SMTP_HOST=
SMTP_PORT=

SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

Add AI provider keys as needed:

```env
VOYAGE_API_KEY=
OPENROUTER_API_KEY=
GEMINI_API_KEY=
DEEPGRAM_API_KEY=
```

## Running the Project with Docker

Start all services:

```bash
docker compose up --build
```

Backend URLs:

```txt
API:    http://localhost:8000
Health: http://localhost:8000/health
Docs:   http://localhost:8000/docs
```

MinIO:

```txt
S3 API:  http://localhost:9000
Console: http://localhost:9001
```

MailHog:

```txt
SMTP: http://localhost:8025
```

## Running Migrations

Run migrations inside the API container:

```bash
docker compose exec api alembic upgrade head
```

Create a new migration:

```bash
docker compose exec api alembic revision --autogenerate -m "add new table"
```

Run migrations locally:

```bash
alembic upgrade head
```

## Running the Backend Locally

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

```bash
# Linux / macOS
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn app.main:app --reload
```

Or:

```bash
fastapi dev app/main.py
```

## Running Seeders

Run role seeder:

```bash
python -m app.seeders.roles_seeder
```

Run admin seeder:

```bash
python -m app.seeders.admin_seeder
```

## Running Celery Worker

Start the Celery worker:

```bash
celery -A app.core.celery_app.celery_app worker --loglevel=INFO
```

Celery is responsible for background jobs such as:

- document parsing
- text extraction
- chunk generation
- embedding generation
- voice transcription processing
- knowledge object extraction
- conflict detection
- long-running AI tasks

## Running the Client

Go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

The client app will usually run at:

```txt
http://localhost:5173
```

## Main Data Flow

### Document Knowledge Flow

```txt
Admin uploads document
→ file stored in MinIO
→ metadata stored in PostgreSQL
→ Celery parses document
→ text is chunked
→ embeddings are generated
→ chunks are stored in pgvector
→ approved knowledge becomes searchable
```

### Voice Knowledge Flow

```txt
Field Worker / SME records voice note
→ audio sent to backend
→ speech-to-text transcription
→ structured safety knowledge extraction
→ user reviews extracted knowledge
→ saved as Knowledge Object
→ Field Worker notes become pending_review
→ SME/Admin notes can become approved
```

### RAG Safety Answer Flow

```txt
User asks safety question
→ backend identifies tenant, role, site, and topic
→ query embedding is generated
→ pgvector searches approved knowledge chunks
→ results are filtered by tenant/site/status/role
→ answer is generated as a structured Knowledge Card
→ citations are returned
```

## Knowledge Object Status Rules

Knowledge Objects can move through review states such as:

```txt
draft
pending_review
approved
rejected
archived
superseded
```

Important rule:

```txt
Field worker voice notes should be saved as pending_review.
SME and admin voice notes can be saved as approved.
```

Only approved knowledge should be used for trusted field worker answers.

## Safety and Compliance Rules

This project is designed for safety-sensitive workflows.

Important rules:

- do not hard-delete safety records unless truly required
- prefer soft delete or archive
- keep audit logs for important actions
- do not use unapproved knowledge for field guidance
- block or warn when high-severity conflicts exist
- keep citations connected to original sources
- isolate data by tenant and site
- use SME review before knowledge becomes trusted

## Key API Areas

Typical API areas include:

```txt
/auth
/users
/sites
/documents
/knowledge-objects
/voice
/incidents
/chats
/reviews
/conflicts
/feedback
/audit-logs
```

Use the live FastAPI docs to inspect exact routes:

```txt
http://localhost:8000/docs
```

## Development Guidelines

### Backend

- keep routes thin
- keep business logic in services
- use Pydantic schemas for validation
- use async SQLAlchemy sessions
- use Alembic for schema changes
- use soft delete for safety/compliance data
- keep tenant isolation strict
- avoid hardcoded provider logic inside routes

### Client

- use feature-first folders
- use TanStack Query for server state
- use services for API calls
- use Shadcn/UI primitives
- use React Hook Form for forms
- use centralized cache keys
- invalidate queries after mutations
- use toast for success and failure states
- avoid fake data and mock APIs
- keep UI serious, minimal, and safety-focused

## Production Notes

For production deployment, review:

- secure environment variables
- database backups
- MinIO persistence
- Redis persistence strategy
- HTTPS
- CORS policy
- SMTP provider
- AI provider keys
- logging and monitoring
- Celery worker scaling
- migration workflow
- object storage lifecycle policy
- tenant data isolation checks

## Health Check

Basic health endpoint:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

## License

Add your project license here.
