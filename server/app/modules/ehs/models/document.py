import uuid
from datetime import date, datetime

from sqlalchemy import (
    BigInteger,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Index,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin, TenantMixin
from app.db.database import Base


document_sites = Table(
    "document_sites",
    Base.metadata,
    Column("document_id", UUID(as_uuid=True), ForeignKey(
        "documents.id", ondelete="CASCADE"), primary_key=True),
    Column("site_id", UUID(as_uuid=True), ForeignKey(
        "sites.id", ondelete="CASCADE"), primary_key=True),
    Column("tenant_id", UUID(as_uuid=True), ForeignKey(
        "tenants.id", ondelete="CASCADE"), nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
    UniqueConstraint("document_id", "site_id",
                     name="uq_document_sites_document_id_site_id"),
)


class Document(BaseTable, SoftDeleteMixin, TenantMixin):
    __tablename__ = 'documents'
    __table_args__ = (
        Index("ix_documents_site_id", "site_id"),
        Index("ix_documents_source_scope", "source_scope"),
        Index("ix_documents_status", "status"),
        Index("ix_documents_topic", "topic"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False
    )
    site_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sites.id"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    file_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    file_size_bytes: Mapped[int | None] = mapped_column(
        BigInteger, nullable=True)
    source_scope: Mapped[str] = mapped_column(String(32), nullable=False)
    document_type: Mapped[str | None] = mapped_column(
        String(64), nullable=True)
    topic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    version: Mapped[str | None] = mapped_column(String(64), nullable=True)
    effective_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        String(32), default="uploaded", nullable=False)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    approved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    processing_error: Mapped[str | None] = mapped_column(Text, nullable=True)

    site = relationship("Site", back_populates="primary_documents")
    sites = relationship("Site", secondary=document_sites,
                         back_populates="documents")
    uploaded_by_user = relationship(
        "User", back_populates="uploaded_documents", foreign_keys=[uploaded_by]
    )
    approved_by_user = relationship(
        "User", back_populates="approved_documents", foreign_keys=[approved_by]
    )
