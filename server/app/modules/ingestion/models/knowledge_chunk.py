import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.core.base_table import BaseTable, SoftDeleteMixin, TenantMixin


class KnowledgeChunk(BaseTable, SoftDeleteMixin, TenantMixin):
    __tablename__ = "knowledge_chunks"

    __table_args__ = (
        Index("ix_knowledge_chunks_source_type", "source_type"),
        Index("ix_knowledge_chunks_source_id", "source_id"),
        Index("ix_knowledge_chunks_topic", "topic"),
        Index("ix_knowledge_chunks_task_type", "task_type"),
        Index("ix_knowledge_chunks_risk_level", "risk_level"),
        Index("ix_knowledge_chunks_status", "status"),
        Index("ix_knowledge_chunks_source_scope", "source_scope"),
        Index(
            "ix_knowledge_chunks_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )

    site_ids: Mapped[list[uuid.UUID] | None] = mapped_column(
        ARRAY(UUID(as_uuid=True)),
        nullable=True,
    )

    source_type: Mapped[str] = mapped_column(String(64), nullable=False)

    source_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )

    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(1024),
        nullable=True,
    )

    topic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    task_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    asset_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source_scope: Mapped[str | None] = mapped_column(String(32), nullable=True)
    risk_level: Mapped[str | None] = mapped_column(String(32), nullable=True)

    status: Mapped[str] = mapped_column(
        String(32),
        default="active",
        nullable=False,
    )

    page_number: Mapped[int | None] = mapped_column(nullable=True)
    section_title: Mapped[str | None] = mapped_column(
        String(255), nullable=True)

    confidence_score: Mapped[Decimal | None] = mapped_column(
        Numeric(4, 3),
        nullable=True,
    )

    celery_task_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True)
