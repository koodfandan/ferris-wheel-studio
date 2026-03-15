from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class ImportJob(Base):
    __tablename__ = "import_jobs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    status: Mapped[str] = mapped_column(String(40), index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    source_image_key: Mapped[str] = mapped_column(String(255))
    mode: Mapped[str] = mapped_column(String(32), default="single-image")
    texture_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    style: Mapped[str] = mapped_column(String(32), default="toy")
    asset_id: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GeneratedAsset(Base):
    __tablename__ = "generated_assets"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    model_glb_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    preview_image_key: Mapped[str] = mapped_column(String(255))
    source_image_key: Mapped[str] = mapped_column(String(255))
    manifest_key: Mapped[str] = mapped_column(String(255))
    generator: Mapped[str] = mapped_column(String(64))
    texture_model: Mapped[str] = mapped_column(String(64))
    source_type: Mapped[str] = mapped_column(String(64), default="image-import")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
