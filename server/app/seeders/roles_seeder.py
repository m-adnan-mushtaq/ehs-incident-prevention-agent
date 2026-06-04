"""Seed roles: admin, sme, field_worker."""
import asyncio
from sqlalchemy import select

from app.core.database import SessionLocal
from app.modules.user.models.user import User  # noqa: F401
from app.modules.jwt_token.models.token import Token
from app.modules.role.models.role import Role
from app.modules.document.models.document import Document
from app.modules.sites.models.site import Site
from app.modules.knowledge.models.knowledge_object import KnowledgeObject
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk
from app.modules.incident.models.incident import Incident
from app.modules.chat.models.chat import ChatSession, ChatMessage

ROLES = [
    ("admin", "Administrator with full access"),
    ("sme", "Subject matter expert"),
    ("field_worker", "Field worker"),
]


async def seed_roles():
    async with SessionLocal() as db:
        for name, description in ROLES:
            result = await db.execute(select(Role).where(Role.name == name))
            if result.scalar_one_or_none():
                print(f"Role '{name}' already exists. Skipping.")
                continue
            role = Role(name=name, description=description, is_active=True)
            db.add(role)
            print(f"Created role: {name}")
        await db.commit()
    print("Roles seeding done.")


if __name__ == "__main__":
    asyncio.run(seed_roles())
