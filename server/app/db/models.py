"""Import all ORM models so SQLAlchemy mappers are fully configured."""

from app.modules.chat.models.chat import ChatMessage, ChatSession  # noqa: F401
from app.modules.document.models.document import Document  # noqa: F401
from app.modules.incident.models.incident import Incident  # noqa: F401
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk  # noqa: F401
from app.modules.jwt_token.models.token import Token  # noqa: F401
from app.modules.knowledge.models.knowledge_object import KnowledgeObject  # noqa: F401
from app.modules.role.models.role import Role  # noqa: F401
from app.modules.sites.models.site import Site  # noqa: F401
from app.modules.user.models.user import Tenant, User  # noqa: F401
