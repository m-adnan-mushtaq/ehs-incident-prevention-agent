from google import genai
from google.genai import types
from app.core.config_loader import settings


class EmbeddingService:
    _client = None
    EMBEDDING_DIM = 1024

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return cls._client

    @classmethod
    def embed_text(cls, text: str) -> list[float]:
        text = (text or "").strip()
        if not text:
            raise ValueError("Cannot embed empty text")
        result = cls.get_client().models.embed_content(
            model=settings.GOOGLE_EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=cls.EMBEDDING_DIM,
            ),
        )
        return result.embeddings[0].values

    @classmethod
    def embed_query(cls, text: str) -> list[float]:
        return cls.embed_text(text)

    @classmethod
    def embed_texts(
        cls,
        texts: list[str],
        batch_size: int = 96,
    ) -> list[list[float]]:
        if not texts:
            return []
        embeddings: list[list[float]] = []
        for start in range(0, len(texts), batch_size):
            batch = texts[start: start + batch_size]
            result = cls.get_client().models.embed_content(
                model=settings.GOOGLE_EMBEDDING_MODEL,
                contents=batch,
                config=types.EmbedContentConfig(
                    output_dimensionality=cls.EMBEDDING_DIM,
                ),
            )
            embeddings.extend([emb.values for emb in result.embeddings])
        return embeddings
