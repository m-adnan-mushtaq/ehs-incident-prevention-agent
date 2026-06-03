import re

import pymupdf


def clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf_pages(file_path: str) -> list[dict]:
    pages: list[dict] = []
    with pymupdf.open(file_path) as pdf:
        for page_number, page in enumerate(pdf, start=1):
            content = clean_text(page.get_text("text"))
            pages.append({"page": page_number, "content": content})
    return pages
