import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin


class Conflict(BaseTable, SoftDeleteMixin):
    __tablename__ = 'conflicts'
    __table_args__ = (
        Index("ix_conflicts_tenant_id", "tenant_id"),
        Index("ix_conflicts_site_id", "site_id"),
        Index("ix_conflicts_topic", "topic"),
        Index("ix_conflicts_conflict_type", "conflict_type"),
        Index("ix_conflicts_status", "status"),
        Index("ix_conflicts_severity", "severity"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False
    )
    site_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sites.id"), nullable=True
    )
    topic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    conflict_type: Mapped[str] = mapped_column(String(64), nullable=False)
    source_a_type: Mapped[str] = mapped_column(String(64), nullable=False)
    source_a_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    source_b_type: Mapped[str] = mapped_column(String(64), nullable=False)
    source_b_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    source_a_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_b_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="medium", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="open", nullable=False)
    detected_by: Mapped[str] = mapped_column(String(32), default="ai", nullable=False)
    resolution_action: Mapped[str | None] = mapped_column(String(64), nullable=True)
    resolution_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    resolved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    tenant = relationship("Tenant", back_populates="conflicts")
    site = relationship("Site", back_populates="conflicts")
    resolved_by_user = relationship("User", back_populates="resolved_conflicts")

    # source_a/source_b references remain logical links for Step 1.
