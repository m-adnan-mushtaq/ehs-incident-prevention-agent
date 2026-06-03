from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.base_table import BaseTable, SoftDeleteMixin


class User(BaseTable, SoftDeleteMixin):
    __tablename__ = 'users'

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)

    last_login_at: Mapped[DateTime | None] = mapped_column(
        DateTime, default=None, nullable=True)

    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True, default=None
    )

    tokens = relationship("Token", back_populates="user", passive_deletes=True)
    role = relationship("Role", back_populates="users")
    tenant = relationship("Tenant", back_populates="users")
    uploaded_documents = relationship(
        "Document",
        back_populates="uploaded_by_user",
        foreign_keys="Document.uploaded_by",
    )
    created_knowledge_objects = relationship(
        "KnowledgeObject",
        back_populates="created_by_user",
        foreign_keys="KnowledgeObject.created_by",
    )
    approved_knowledge_objects = relationship(
        "KnowledgeObject",
        back_populates="approved_by_user",
        foreign_keys="KnowledgeObject.approved_by",
    )
    reported_incidents = relationship(
        "Incident",
        back_populates="reported_by_user",
        foreign_keys="Incident.reported_by",
    )


class Tenant(BaseTable, SoftDeleteMixin):
    __tablename__ = 'tenants'

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(
        String(32), default="active", nullable=False)

    users = relationship("User", back_populates="tenant")
    sites = relationship("Site", back_populates="tenant")
    incidents = relationship("Incident", back_populates="tenant")
