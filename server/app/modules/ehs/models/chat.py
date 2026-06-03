import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin


class ChatSession(BaseTable, SoftDeleteMixin):
    __tablename__ = 'chat_sessions'
    __table_args__ = (
        Index("ix_chat_sessions_tenant_id", "tenant_id"),
        Index("ix_chat_sessions_site_id", "site_id"),
        Index("ix_chat_sessions_user_id", "user_id"),
        Index("ix_chat_sessions_status", "status"),
        Index("ix_chat_sessions_mode", "mode"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False
    )
    site_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sites.id"), nullable=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    mode: Mapped[str] = mapped_column(String(64), nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)

    tenant = relationship("Tenant", back_populates="chat_sessions")
    site = relationship("Site", back_populates="chat_sessions")
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")


class ChatMessage(BaseTable, SoftDeleteMixin):
    __tablename__ = 'chat_messages'
    __table_args__ = (
        Index("ix_chat_messages_chat_session_id", "chat_session_id"),
        Index("ix_chat_messages_tenant_id", "tenant_id"),
        Index("ix_chat_messages_site_id", "site_id"),
        Index("ix_chat_messages_user_id", "user_id"),
        Index("ix_chat_messages_role", "role"),
        Index("ix_chat_messages_message_type", "message_type"),
    )

    chat_session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chat_sessions.id"), nullable=False
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False
    )
    site_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sites.id"), nullable=True
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    role: Mapped[str] = mapped_column(String(32), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(String(64), default="text", nullable=False)
    confidence_score: Mapped[Decimal | None] = mapped_column(Numeric(4, 3), nullable=True)
    rag_metadata: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    session = relationship("ChatSession", back_populates="messages")
    tenant = relationship("Tenant", back_populates="chat_messages")
    site = relationship("Site", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")
    feedback = relationship("Feedback", back_populates="chat_message")
