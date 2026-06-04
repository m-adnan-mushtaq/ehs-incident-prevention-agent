from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from .core.config_loader import settings
from fastapi.exceptions import RequestValidationError
from app.utils.exception_utils import validation_exception_handler
from app.modules.auth.routes.auth_router import auth_router
from app.modules.user.routes.user_router import user_router
from app.modules.role.routes.role_router import role_router
from app.modules.sites.routes.site_router import site_router
from app.modules.document.routes.document_router import document_router
from app.modules.knowledge.routes.knowledge_router import knowledge_router
from app.modules.ingestion.routes.ingestion_router import ingestion_router
from app.modules.incident.routes.incident_router import incident_router
from app.modules.chat.routes.chat_router import chat_router
from app.realtime.socket_manager import socket_manager

openapi_tags = [
    {"name": "Health Checks", "description": "Application health checks"},
    {"name": "Auth", "description": "Authentication"},
    {"name": "Users", "description": "User management"},
    {"name": "Roles", "description": "Role listing"},
    {"name": "Sites", "description": "Site management"},
    {"name": "Documents", "description": "Document management"},
    {"name": "Knowledge", "description": "Knowledge object management"},
    {"name": "Ingestion", "description": "Embedding ingestion retries"},
    {"name": "Incidents", "description": "Incident reporting and management"},
    {"name": "Chat", "description": "Chat sessions and RAG assistant messaging"},
]

app = FastAPI(title="EHS API", openapi_tags=openapi_tags)

if settings.BACKEND_CORS_ORIGINS:
    origins = [o.strip()
               for o in settings.BACKEND_CORS_ORIGINS.split(",") if o.strip()]
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_methods=["*"],
            allow_headers=["*"],
        )

app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(role_router)
app.include_router(site_router)
app.include_router(document_router)
app.include_router(knowledge_router)
app.include_router(ingestion_router)
app.include_router(incident_router)
app.include_router(chat_router)
app.mount("/socket.io/", socket_manager.app)


@app.get("/health", tags=["Health Checks"])
def read_root():
    return {"status": "ok"}

