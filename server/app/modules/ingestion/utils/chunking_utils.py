from app.modules.ingestion.constants import CHUNK_OVERLAP, CHUNK_SIZE


def chunk_pages(
    pages: list[dict],
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> list[dict]:
    chunks: list[dict] = []
    chunk_index = 0

    for page in pages:
        page_number = page["page"]
        text = (page.get("content") or "").strip()
        if not text:
            continue

        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            piece = text[start:end].strip()
            if piece:
                chunks.append(
                    {
                        "chunk_index": chunk_index,
                        "text": piece,
                        "start_page": page_number,
                        "end_page": page_number,
                    }
                )
                chunk_index += 1
            if end >= len(text):
                break
            start = max(end - chunk_overlap, start + 1)

    return chunks
