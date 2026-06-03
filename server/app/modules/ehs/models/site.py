import uuid

from sqlalchemy import ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin


class Site(BaseTable, SoftDeleteMixin):
    __tablename__ = 'sites'
    __table_args__ = (
        UniqueConstraint("tenant_id", "name", name="uq_sites_tenant_id_name"),
        Index("ix_sites_tenant_id", "tenant_id"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)

    tenant = relationship("Tenant", back_populates="sites")
    users_defaulting_here = relationship("User", back_populates="default_site")
    user_sites = relationship("UserSite", back_populates="site")
    documents = relationship(
        "Document", secondary="document_sites", back_populates="sites"
    )
    primary_documents = relationship("Document", back_populates="site")
    incidents = relationship("Incident", back_populates="site")
    knowledge_objects = relationship("KnowledgeObject", back_populates="site")
    knowledge_chunks = relationship("KnowledgeChunk", back_populates="site")
    chat_sessions = relationship("ChatSession", back_populates="site")
    chat_messages = relationship("ChatMessage", back_populates="site")
    conflicts = relationship("Conflict", back_populates="site")
    feedback = relationship("Feedback", back_populates="site")
    audit_logs = relationship("AuditLog", back_populates="site")
