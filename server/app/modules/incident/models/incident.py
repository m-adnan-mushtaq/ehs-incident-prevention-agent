import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin, TenantMixin


class Incident(BaseTable, SoftDeleteMixin, TenantMixin):
    __tablename__ = 'incidents'
    __table_args__ = (
        Index("ix_incidents_site_id", "site_id"),
        Index("ix_incidents_status", "status"),
        Index("ix_incidents_incident_type", "incident_type"),
        Index("ix_incidents_task_type", "task_type"),
        Index("ix_incidents_severity", "severity"),
    )

    site_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sites.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    incident_type: Mapped[str | None] = mapped_column(
        String(64), nullable=True)
    task_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    asset_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    severity: Mapped[str | None] = mapped_column(String(32), nullable=True)
    occurred_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reported_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    corrective_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    lessons_learned: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(32), default="draft", nullable=False)

    tenant = relationship("Tenant", back_populates="incidents")
    site = relationship("Site", back_populates="incidents")
    reported_by_user = relationship(
        "User", back_populates="reported_incidents")
