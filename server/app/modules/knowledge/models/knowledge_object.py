import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_table import BaseTable, SoftDeleteMixin, TenantMixin


class KnowledgeObject(BaseTable, SoftDeleteMixin, TenantMixin):
    __tablename__ = "knowledge_objects"

    __table_args__ = (
        Index("ix_knowledge_objects_source_type", "source_type"),
        Index("ix_knowledge_objects_source_id", "source_id"),
        Index("ix_knowledge_objects_topic", "topic"),
        Index("ix_knowledge_objects_task_type", "task_type"),
        Index("ix_knowledge_objects_risk_level", "risk_level"),
        Index("ix_knowledge_objects_status", "status"),
        Index("ix_knowledge_objects_created_by", "created_by"),
    )

    site_ids: Mapped[list[uuid.UUID] | None] = mapped_column(
        ARRAY(UUID(as_uuid=True)),
        nullable=True,
    )
    source_type: Mapped[str] = mapped_column(String(64), nullable=False)
    source_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    topic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    task_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    asset_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    risk_level: Mapped[str | None] = mapped_column(String(32), nullable=True)
    problem: Mapped[str | None] = mapped_column(Text, nullable=True)
    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommended_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    lesson_learned: Mapped[str | None] = mapped_column(Text, nullable=True)
    safety_warning: Mapped[str | None] = mapped_column(Text, nullable=True)
    required_ppe: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    stop_work_triggers: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(
        String(32),
        default="draft",
        nullable=False,
    )
    confidence_score: Mapped[Decimal | None] = mapped_column(
        Numeric(4, 3),
        nullable=True,
    )
    sme_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    approved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_by_user = relationship(
        "User",
        back_populates="created_knowledge_objects",
        foreign_keys=[created_by],
    )
    approved_by_user = relationship(
        "User",
        back_populates="approved_knowledge_objects",
        foreign_keys=[approved_by],
    )
