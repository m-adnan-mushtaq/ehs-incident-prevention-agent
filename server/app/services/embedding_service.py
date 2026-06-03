from app.core.config_loader import settings
import voyageai


class EmbeddingService:
    _client = None
    EMBEDDING_DIM = 1024

    @classmethod
    def get_client(cls):
        if cls._client is None:

            cls._client = voyageai.Client(api_key=settings.VOYAGE_API_KEY)
        return cls._client

    @classmethod
    def embed_text(cls, text: str) -> list[float]:
        text = (text or "").strip()
        if not text:
            raise ValueError("Cannot embed empty text")
        result = cls.get_client().embed(
            [text],
            model=settings.VOYAGE_EMBEDDING_MODEL,
            input_type="document",
        )
        return result.embeddings[0]

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
            result = cls.get_client().embed(
                batch,
                model=settings.VOYAGE_EMBEDDING_MODEL,
                input_type="document",
                output_dimension=1024,
            )
            embeddings.extend(result.embeddings)
        return embeddings
