import asyncio
import base64
import json
import logging
import re
import uuid
from collections import OrderedDict
from decimal import Decimal
from pathlib import Path
from time import perf_counter
from typing import Any

import httpx
from fastapi import HTTPException, UploadFile
from fastapi.encoders import jsonable_encoder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config_loader import settings
from app.modules.chat.constants import (
    CHAT_MODE_IMAGE_CHECK,
    CHAT_MODE_INCIDENT_PREVENTION,
    CHAT_MODE_NORMAL,
    CHAT_STATUS_ACTIVE,
    INTENT_DEFINITION_QUESTION,
    INTENT_GENERAL_SAFETY_QUESTION,
    INTENT_PRACTICAL_SAFETY_QUESTION,
    INTENT_SPECIFIC_INCIDENT_SEARCH,
    MESSAGE_ROLE_ASSISTANT,
    MESSAGE_ROLE_USER,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_TEXT,
    MESSAGE_TYPE_TEXT_IMAGE,
    RAG_LANE_EXPERT_KNOWLEDGE,
    RAG_LANE_OFFICIAL_GUIDANCE,
    RAG_LANE_SIMILAR_INCIDENTS,
)
from app.modules.chat.models.chat import ChatMessage, ChatSession
from app.modules.chat.schemas.chat import ChatSessionCreate
from app.modules.chat.services.chat_image_upload_service import (
    cleanup_chat_image_temp_file,
    save_chat_image_upload,
    upload_chat_image_to_s3,
)
from app.modules.ingestion.constants import (
    CHUNK_STATUS_ACTIVE,
    SOURCE_TYPE_DOCUMENT,
    SOURCE_TYPE_INCIDENT,
    SOURCE_TYPE_KNOWLEDGE_OBJECT,
)
from app.modules.ingestion.models.knowledge_chunk import KnowledgeChunk
from app.modules.sites.models.site import Site
from app.modules.user.models.user import User
from app.realtime.socket_manager import SocketEvents, socket_manager
from app.services.embedding_service import EmbeddingService


LANE_SOURCE_TYPES = {
    RAG_LANE_OFFICIAL_GUIDANCE: SOURCE_TYPE_DOCUMENT,
    RAG_LANE_EXPERT_KNOWLEDGE: SOURCE_TYPE_KNOWLEDGE_OBJECT,
    RAG_LANE_SIMILAR_INCIDENTS: SOURCE_TYPE_INCIDENT,
}
SOURCE_TYPE_LANES = {source_type: lane for lane,
                     source_type in LANE_SOURCE_TYPES.items()}

logger = logging.getLogger(__name__)

RESPONSE_PROFILE_SMALL_TALK = "small_talk"
RESPONSE_PROFILE_DEFINITION = "definition"
RESPONSE_PROFILE_QUICK_ANSWER = "quick_answer"
RESPONSE_PROFILE_IMAGE_OBSERVATION = "image_observation"
RESPONSE_PROFILE_PRACTICAL_GUIDANCE = "practical_guidance"
RESPONSE_PROFILE_INCIDENT_PREVENTION_BRIEF = "incident_prevention_brief"
RESPONSE_PROFILE_INCIDENT_HISTORY = "incident_history"

SMALL_TALK_PATTERNS = (
    r"^\s*(hi|hello|hey|thanks|thank you|ok|okay|good morning|good afternoon|good evening)\s*[.!?]*\s*$",
)

IMAGE_RULE_PATTERNS = (
    r"\b(rule|procedure|standard|requirement|ppe|required|should|measure|skip|miss|wrong|hazard|safe|unsafe)\b",
)

PROFILE_LIMITS = {
    RESPONSE_PROFILE_DEFINITION: {
        RAG_LANE_OFFICIAL_GUIDANCE: 3,
        RAG_LANE_EXPERT_KNOWLEDGE: 0,
        RAG_LANE_SIMILAR_INCIDENTS: 0,
    },
    RESPONSE_PROFILE_QUICK_ANSWER: {
        RAG_LANE_OFFICIAL_GUIDANCE: 3,
        RAG_LANE_EXPERT_KNOWLEDGE: 2,
        RAG_LANE_SIMILAR_INCIDENTS: 0,
    },
    RESPONSE_PROFILE_IMAGE_OBSERVATION: {
        RAG_LANE_OFFICIAL_GUIDANCE: 2,
        RAG_LANE_EXPERT_KNOWLEDGE: 0,
        RAG_LANE_SIMILAR_INCIDENTS: 0,
    },
    RESPONSE_PROFILE_PRACTICAL_GUIDANCE: {
        RAG_LANE_OFFICIAL_GUIDANCE: 3,
        RAG_LANE_EXPERT_KNOWLEDGE: 2,
        RAG_LANE_SIMILAR_INCIDENTS: 0,
    },
    RESPONSE_PROFILE_INCIDENT_PREVENTION_BRIEF: {
        RAG_LANE_OFFICIAL_GUIDANCE: 3,
        RAG_LANE_EXPERT_KNOWLEDGE: 2,
        RAG_LANE_SIMILAR_INCIDENTS: 3,
    },
    RESPONSE_PROFILE_INCIDENT_HISTORY: {
        RAG_LANE_OFFICIAL_GUIDANCE: 2,
        RAG_LANE_EXPERT_KNOWLEDGE: 0,
        RAG_LANE_SIMILAR_INCIDENTS: 5,
    },
}

PROFILE_MIN_RELEVANCE = {
    RESPONSE_PROFILE_DEFINITION: 0.48,
    RESPONSE_PROFILE_QUICK_ANSWER: 0.48,
    RESPONSE_PROFILE_IMAGE_OBSERVATION: 0.52,
    RESPONSE_PROFILE_PRACTICAL_GUIDANCE: 0.45,
    RESPONSE_PROFILE_INCIDENT_PREVENTION_BRIEF: 0.40,
    RESPONSE_PROFILE_INCIDENT_HISTORY: 0.40,
}

SOCKET_STATUS_META = {
    "received": ("Request received", 5),
    "image_analysis_started": ("Analyzing image...", 15),
    "image_analysis_completed": ("Image analysis complete", 25),
    "image_upload_started": ("Saving image...", 30),
    "image_upload_completed": ("Image saved", 35),
    "intent_classified": ("Understanding request...", 40),
    "retrieval_started": ("Finding relevant safety guidance...", 50),
    "retrieval_completed": ("Safety guidance reviewed", 68),
    "answer_generation_started": ("Preparing answer...", 76),
    "answer_generation_completed": ("Answer drafted", 88),
    "saving_answer": ("Saving answer...", 94),
    "completed": ("Answer ready", 100),
    "failed": ("Safety check could not complete", None),
}

ALLOWED_CHAT_MODES = {
    CHAT_MODE_NORMAL,
    CHAT_MODE_INCIDENT_PREVENTION,
    CHAT_MODE_IMAGE_CHECK,
}

DEFINITION_PATTERNS = (
    r"\bwhat\s+(is|are|does|do)\b",
    r"\bwhat\s+does\b.+\bmean\b",
    r"\bdefine\b",
    r"\bdefinition\b",
    r"\bexplain\b",
    r"\btell\s+me\s+what\b",
)

PRACTICAL_PATTERNS = (
    r"\bwhat\s+ppe\b",
    r"\bppe\s+(is\s+)?required\b",
    r"\bhow\s+(do|should|can)\s+i\b",
    r"\bsteps?\s+should\s+i\b",
    r"\bprocedure\b",
    r"\bchecklist\b",
    r"\binspect\b",
    r"\bcleanup\b",
    r"\bclean\s*up\b",
)

EXPLICIT_INCIDENT_PATTERNS = (
    r"\bhave\s+we\s+seen\s+this\s+before\b",
    r"\bhas\s+this\s+happened\s+before\b",
    r"\bsimilar\s+incidents?\b",
    r"\bshow\s+.*incidents?\b",
    r"\bincident\s+history\b",
    r"\bnear\s+miss\s+history\b",
    r"\bpast\s+(events?|incidents?|failures?)\b",
    r"\bprevious\s+(events?|incidents?|failures?)\b",
    r"\brepeated\s+(hazards?|failures?|issues?)\b",
    r"\bany\s+near\s+miss(es)?\s+(for|with|on|in)\b",
    r"\bwhat\s+incidents?\s+happened\b",
    r"\bexamples?\s+from\s+incidents?\b",
)


def classify_chat_intent(mode: str, user_query: str) -> str:
    query = (user_query or "").strip().lower()
    if mode == CHAT_MODE_INCIDENT_PREVENTION:
        return INTENT_PRACTICAL_SAFETY_QUESTION
    if _matches_any(query, EXPLICIT_INCIDENT_PATTERNS):
        return INTENT_SPECIFIC_INCIDENT_SEARCH
    if _matches_any(query, DEFINITION_PATTERNS):
        return INTENT_DEFINITION_QUESTION
    if _matches_any(query, PRACTICAL_PATTERNS):
        return INTENT_PRACTICAL_SAFETY_QUESTION
    return INTENT_GENERAL_SAFETY_QUESTION


def get_response_profile(
    mode: str,
    intent: str,
    user_query: str,
    has_image: bool,
) -> str:
    query = (user_query or "").strip().lower()
    word_count = len(query.split())

    if not has_image and _matches_any(query, SMALL_TALK_PATTERNS):
        return RESPONSE_PROFILE_SMALL_TALK
    if mode == CHAT_MODE_INCIDENT_PREVENTION:
        return RESPONSE_PROFILE_INCIDENT_PREVENTION_BRIEF
    if intent == INTENT_SPECIFIC_INCIDENT_SEARCH:
        return RESPONSE_PROFILE_INCIDENT_HISTORY
    if has_image:
        return RESPONSE_PROFILE_IMAGE_OBSERVATION
    if intent == INTENT_DEFINITION_QUESTION:
        return RESPONSE_PROFILE_DEFINITION
    if intent == INTENT_PRACTICAL_SAFETY_QUESTION:
        return (
            RESPONSE_PROFILE_QUICK_ANSWER
            if word_count <= 12
            else RESPONSE_PROFILE_PRACTICAL_GUIDANCE
        )
    return RESPONSE_PROFILE_QUICK_ANSWER


def get_retrieval_policy(
    mode: str,
    intent: str,
    user_query: str,
    response_profile: str,
    has_image: bool = False,
) -> dict[str, bool]:
    if response_profile == RESPONSE_PROFILE_SMALL_TALK:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: False,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    explicit_incident_search = intent == INTENT_SPECIFIC_INCIDENT_SEARCH or _matches_any(
        (user_query or "").lower(),
        EXPLICIT_INCIDENT_PATTERNS,
    )
    if response_profile == RESPONSE_PROFILE_DEFINITION:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    if response_profile == RESPONSE_PROFILE_INCIDENT_HISTORY:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: True,
        }
    if response_profile == RESPONSE_PROFILE_IMAGE_OBSERVATION:
        needs_guidance = _matches_any(
            (user_query or "").lower(), IMAGE_RULE_PATTERNS)
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: needs_guidance,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    if mode == CHAT_MODE_INCIDENT_PREVENTION:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: True,
            RAG_LANE_SIMILAR_INCIDENTS: True,
        }
    if explicit_incident_search:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: True,
        }
    if mode == CHAT_MODE_IMAGE_CHECK:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: True,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    if intent == INTENT_DEFINITION_QUESTION:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: False,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    if intent == INTENT_PRACTICAL_SAFETY_QUESTION:
        return {
            RAG_LANE_OFFICIAL_GUIDANCE: True,
            RAG_LANE_EXPERT_KNOWLEDGE: True,
            RAG_LANE_SIMILAR_INCIDENTS: False,
        }
    return {
        RAG_LANE_OFFICIAL_GUIDANCE: True,
        RAG_LANE_EXPERT_KNOWLEDGE: True,
        RAG_LANE_SIMILAR_INCIDENTS: False,
    }


def _matches_any(query: str, patterns: tuple[str, ...]) -> bool:
    return any(re.search(pattern, query) for pattern in patterns)


class ChatHistoryCache:
    def __init__(self, max_sessions: int = 512, max_messages: int = 12):
        self.max_sessions = max_sessions
        self.max_messages = max_messages
        self._cache: OrderedDict[str, list[dict[str, str]]] = OrderedDict()

    def get(self, session_id: uuid.UUID) -> list[dict[str, str]]:
        key = str(session_id)
        history = self._cache.get(key, [])
        if key in self._cache:
            self._cache.move_to_end(key)
        return list(history)

    def append(self, session_id: uuid.UUID, role: str, content: str) -> None:
        key = str(session_id)
        history = self._cache.setdefault(key, [])
        history.append({"role": role, "content": content})
        self._cache[key] = history[-self.max_messages:]
        self._cache.move_to_end(key)
        while len(self._cache) > self.max_sessions:
            self._cache.popitem(last=False)


chat_history_cache = ChatHistoryCache()


class ChatRAGService:
    def __init__(self):
        self._llm = ChatOpenAI(
            model=settings.OPENROUTER_MODEL,
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            temperature=0.1,
        )
        self._answer_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are an EHS safety assistant. "
                        "Answer only from the provided context when making safety claims. "
                        "Return valid JSON only. Follow the retrieval policy exactly. "
                        "Write user-facing answer text (and knowledge_card answer.summary) "
                        "in GitHub-flavored Markdown: use ## headings, bullet lists, "
                        "and **bold** for critical safety terms. "
                        "{policy_instructions}\n\n"
                        "{output_contract}"
                    ),
                ),
                (
                    "human",
                    (
                        "Mode: {mode}\n\n"
                        "Intent: {intent}\n\n"
                        "Retrieval policy: {retrieval_policy}\n\n"
                        "Chat history:\n{history}\n\n"
                        "User request:\n{question}\n\n"
                        "Image context:\n{image_context}\n\n"
                        "Retrieved source context:\n{rag_context}\n\n"
                        "Build the structured safety response now."
                    ),
                ),
            ]
        )
        self._answer_chain = self._answer_prompt | self._llm | StrOutputParser()

    async def create_session(
        self,
        db: AsyncSession,
        payload: ChatSessionCreate,
        current_user: User,
    ) -> ChatSession:
        if payload.mode not in ALLOWED_CHAT_MODES:
            raise HTTPException(
                status_code=400, detail="Unsupported chat mode")
        if payload.site_id:
            await self._validate_site(db, payload.site_id, current_user)

        session = ChatSession(
            tenant_id=current_user.tenant_id,
            site_id=payload.site_id,
            user_id=current_user.id,
            mode=payload.mode,
            title=payload.title,
            status=CHAT_STATUS_ACTIVE,
        )
        db.add(session)
        await db.flush()
        await db.refresh(session)
        return session

    async def list_sessions(
        self,
        db: AsyncSession,
        current_user: User,
    ) -> list[ChatSession]:
        result = await db.execute(
            select(ChatSession)
            .where(
                ChatSession.tenant_id == current_user.tenant_id,
                ChatSession.user_id == current_user.id,
                ChatSession.deleted_at.is_(None),
            )
            .order_by(ChatSession.updated_at.desc())
        )
        return list(result.scalars().all())

    async def get_messages(
        self,
        db: AsyncSession,
        session_id: str,
        current_user: User,
    ) -> list[ChatMessage]:
        session = await self._get_session(db, session_id, current_user)
        result = await db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.chat_session_id == session.id,
                ChatMessage.tenant_id == current_user.tenant_id,
                ChatMessage.deleted_at.is_(None),
            )
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars().all())

    async def process_message(
        self,
        db: AsyncSession,
        session_id: str,
        current_user: User,
        message: str | None,
        image: UploadFile | None,
    ) -> dict[str, Any]:
        total_start = perf_counter()
        timings: dict[str, float] = {}
        session_start = perf_counter()
        session = await self._get_session(db, session_id, current_user)
        timings["session_lookup_ms"] = self._elapsed_ms(session_start)
        chat_session_id = session.id
        text = (message or "").strip()
        has_image = image is not None
        if not text and not has_image:
            raise HTTPException(
                status_code=400, detail="Message or image is required")

        image_info = None
        assistant_message_id = None
        try:
            if image:
                image_save_start = perf_counter()
                image_info = await save_chat_image_upload(
                    image,
                    current_user.tenant_id,
                )
                timings["image_temp_save_ms"] = self._elapsed_ms(
                    image_save_start)

            message_type = self._message_type(text, has_image)
            user_content = text or "[Image uploaded for safety review]"
            user_message = ChatMessage(
                chat_session_id=session.id,
                tenant_id=current_user.tenant_id,
                site_id=session.site_id,
                user_id=current_user.id,
                role=MESSAGE_ROLE_USER,
                content=user_content,
                message_type=message_type,
            )
            db.add(user_message)
            await db.flush()

            user_message_id = user_message.id
            assistant_message_id = uuid.uuid4()
            await self._emit(
                chat_session_id,
                SocketEvents.CHAT_PROGRESS,
                assistant_message_id,
                "received",
                {"user_message_id": str(user_message_id)},
            )

            return await self._complete_message(
                db=db,
                session=session,
                current_user=current_user,
                user_message=user_message,
                assistant_message_id=assistant_message_id,
                text=text,
                user_content=user_content,
                image_info=image_info,
                timings=timings,
            )
        except Exception as exc:
            await db.rollback()
            if assistant_message_id:
                try:
                    await self._emit(
                        chat_session_id,
                        SocketEvents.CHAT_ERROR,
                        assistant_message_id,
                        "failed",
                        {"error": str(getattr(exc, "detail", None) or exc)},
                    )
                except Exception:
                    pass
            raise
        finally:
            if image_info:
                cleanup_chat_image_temp_file(image_info.get("temp_path"))
            timings["total_request_ms"] = self._elapsed_ms(total_start)
            self._log_timing(
                "chat_message_processing",
                session_id=chat_session_id,
                user_id=current_user.id,
                tenant_id=current_user.tenant_id,
                mode=session.mode,
                has_image=has_image,
                timings=timings,
            )

    async def _complete_message(
        self,
        db: AsyncSession,
        session: ChatSession,
        current_user: User,
        user_message: ChatMessage,
        assistant_message_id: uuid.UUID,
        text: str,
        user_content: str,
        image_info: dict[str, Any] | None,
        timings: dict[str, float],
    ) -> dict[str, Any]:
        chat_session_id = session.id
        tenant_id = session.tenant_id
        site_id = session.site_id
        user_id = current_user.id
        mode = session.mode

        image_context = ""
        if image_info:
            await self._emit(
                chat_session_id,
                SocketEvents.CHAT_TOOL_STATUS,
                assistant_message_id,
                "image_analysis_started",
            )
            image_analysis_start = perf_counter()
            image_context = await self._analyze_image(
                image_info["temp_path"],
                image_info["image_content_type"],
                text,
            )
            timings["gemini_image_analysis_ms"] = self._elapsed_ms(
                image_analysis_start,
            )
            await self._emit(
                chat_session_id,
                SocketEvents.CHAT_TOOL_STATUS,
                assistant_message_id,
                "image_analysis_completed",
            )
            await self._emit(
                chat_session_id,
                SocketEvents.CHAT_TOOL_STATUS,
                assistant_message_id,
                "image_upload_started",
            )
            image_upload_start = perf_counter()
            upload_chat_image_to_s3(image_info)
            timings["image_upload_ms"] = self._elapsed_ms(image_upload_start)
            user_message.image_key = image_info["image_key"]
            user_message.image_file_name = image_info["image_file_name"]
            user_message.image_content_type = image_info["image_content_type"]
            user_message.image_size_kb = image_info["image_size_kb"]
            await db.flush()
            await self._emit(
                chat_session_id,
                SocketEvents.CHAT_TOOL_STATUS,
                assistant_message_id,
                "image_upload_completed",
                {"image_key": image_info["image_key"]},
            )

        effective_question = self._build_effective_question(
            text, image_context)
        intent = classify_chat_intent(mode, effective_question)
        response_profile = get_response_profile(
            mode,
            intent,
            text or effective_question,
            has_image=image_info is not None,
        )
        retrieval_policy = get_retrieval_policy(
            mode,
            intent,
            effective_question,
            response_profile,
            has_image=image_info is not None,
        )
        await self._emit(
            chat_session_id,
            SocketEvents.CHAT_TOOL_STATUS,
            assistant_message_id,
            "intent_classified",
            {
                "intent": intent,
                "response_profile": response_profile,
            },
        )

        if response_profile == RESPONSE_PROFILE_SMALL_TALK:
            retrieved: dict[str, list[dict[str, Any]]] = {}
            citations: list[dict[str, Any]] = []
            answer = "Hi. Tell me what task, hazard, or safety question you want to check."
            card = {
                "type": "chat_response",
                "status": "answered",
                "answer": answer,
                "citations": [],
                "confidence_score": 1.0,
            }
            confidence_score = 1.0
        else:
            retrieved = {}
            if any(retrieval_policy.values()):
                await self._emit(
                    chat_session_id,
                    SocketEvents.CHAT_TOOL_STATUS,
                    assistant_message_id,
                    "retrieval_started",
                    {
                        "intent": intent,
                        "response_profile": response_profile,
                    },
                )
                retrieved = await self._retrieve_lanes(
                    db,
                    tenant_id=tenant_id,
                    site_id=site_id,
                    question=effective_question,
                    retrieval_policy=retrieval_policy,
                    response_profile=response_profile,
                    timings=timings,
                )
                await self._emit(
                    chat_session_id,
                    SocketEvents.CHAT_TOOL_STATUS,
                    assistant_message_id,
                    "retrieval_completed",
                    {"source_counts": {lane: len(chunks)
                                       for lane, chunks in retrieved.items()}},
                )

            if not any(retrieved.values()) and not image_context:
                answer = (
                    "I do not have strong source context for that yet. "
                    "For high-risk work, verify with your site safety manager "
                    "or the approved procedure before acting."
                )
                citations = []
                card = {
                    "type": "safety_answer",
                    "status": "low_context",
                    "risk_level": None,
                    "answer": answer,
                    "citations": [],
                    "confidence_score": 0.2,
                }
                confidence_score = 0.2
            else:
                history = await self._history_for_session(db, chat_session_id)
                rag_context = self._format_rag_context(
                    retrieved, response_profile)
                await self._emit(
                    chat_session_id,
                    SocketEvents.CHAT_TOOL_STATUS,
                    assistant_message_id,
                    "answer_generation_started",
                )
                llm_start = perf_counter()
                raw_answer = await self._answer_chain.ainvoke(
                    {
                        "mode": mode,
                        "intent": intent,
                        "retrieval_policy": json.dumps(retrieval_policy),
                        "policy_instructions": self._policy_instructions(
                            retrieval_policy,
                            response_profile,
                        ),
                        "output_contract": self._output_contract(
                            mode,
                            intent,
                            response_profile,
                        ),
                        "history": self._format_history(history),
                        "question": effective_question,
                        "image_context": image_context or "No image provided.",
                        "rag_context": rag_context or "No matching source context was found.",
                    }
                )
                timings["llm_answer_generation_ms"] = self._elapsed_ms(
                    llm_start)
                await self._emit(
                    chat_session_id,
                    SocketEvents.CHAT_TOOL_STATUS,
                    assistant_message_id,
                    "answer_generation_completed",
                )

                parse_start = perf_counter()
                card = self._parse_card(
                    raw_answer,
                    mode,
                    intent,
                    effective_question,
                    response_profile,
                )
                card = self._sanitize_card_for_policy(
                    card, mode, retrieval_policy)
                citations = self._build_citations(retrieved)
                self._attach_sources(card, citations, mode, intent)
                confidence_score = self._confidence(card, citations)
                card["confidence_score"] = confidence_score
                answer = self._answer_text(card, raw_answer)
                timings["json_parse_card_formatting_ms"] = self._elapsed_ms(
                    parse_start)

        rag_metadata = self._build_rag_metadata(
            mode=mode,
            intent=intent,
            response_profile=response_profile,
            citations=citations,
            card=card,
            retrieval_policy=retrieval_policy,
            retrieved=retrieved,
            image_context=image_context,
        )
        await self._emit(
            chat_session_id,
            SocketEvents.CHAT_TOOL_STATUS,
            assistant_message_id,
            "saving_answer",
        )
        assistant_message = ChatMessage(
            id=assistant_message_id,
            chat_session_id=chat_session_id,
            tenant_id=tenant_id,
            site_id=site_id,
            user_id=user_id,
            role=MESSAGE_ROLE_ASSISTANT,
            content=answer,
            message_type=MESSAGE_TYPE_TEXT,
            confidence_score=Decimal(str(round(confidence_score, 3))),
            rag_metadata=rag_metadata,
        )
        db.add(assistant_message)
        save_start = perf_counter()
        await db.flush()
        timings["saving_answer_ms"] = self._elapsed_ms(save_start)

        if not session.title:
            session.title = self._title_from_message(user_content)

        chat_history_cache.append(
            chat_session_id, MESSAGE_ROLE_USER, user_content)
        chat_history_cache.append(
            chat_session_id, MESSAGE_ROLE_ASSISTANT, answer)

        payload = {
            "session_id": chat_session_id,
            "user_message_id": user_message.id,
            "assistant_message_id": assistant_message.id,
            "mode": mode,
            "intent": intent,
            "response_profile": response_profile,
            "answer": answer,
            "card": card,
            "citations": citations,
            "confidence_score": confidence_score,
            "rag_metadata": rag_metadata,
        }
        await self._emit(
            chat_session_id,
            SocketEvents.CHAT_FINAL,
            assistant_message.id,
            "completed",
            payload,
        )
        return payload

    async def _get_session(
        self,
        db: AsyncSession,
        session_id: str,
        current_user: User,
    ) -> ChatSession:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id,
                ChatSession.tenant_id == current_user.tenant_id,
                ChatSession.user_id == current_user.id,
                ChatSession.deleted_at.is_(None),
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(
                status_code=404, detail="Chat session not found")
        return session

    async def _history_for_session(
        self,
        db: AsyncSession,
        session_id: uuid.UUID,
    ) -> list[dict[str, str]]:
        cached = chat_history_cache.get(session_id)
        if cached:
            return cached

        result = await db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.chat_session_id == session_id,
                ChatMessage.deleted_at.is_(None),
            )
            .order_by(ChatMessage.created_at.desc())
            .limit(chat_history_cache.max_messages)
        )
        messages = list(reversed(result.scalars().all()))
        for message in messages:
            chat_history_cache.append(
                session_id, message.role, message.content)
        return chat_history_cache.get(session_id)

    async def _validate_site(
        self,
        db: AsyncSession,
        site_id: uuid.UUID,
        current_user: User,
    ) -> None:
        result = await db.execute(
            select(Site.id).where(
                Site.id == site_id,
                Site.tenant_id == current_user.tenant_id,
                Site.deleted_at.is_(None),
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Site not found")

    async def _retrieve_lanes(
        self,
        db: AsyncSession,
        *,
        tenant_id: uuid.UUID,
        site_id: uuid.UUID | None,
        question: str,
        retrieval_policy: dict[str, bool],
        response_profile: str,
        timings: dict[str, float],
    ) -> dict[str, list[dict[str, Any]]]:
        enabled_source_types = [
            source_type
            for lane, source_type in LANE_SOURCE_TYPES.items()
            if retrieval_policy.get(lane, False)
            and self._lane_limit(response_profile, lane) > 0
        ]
        if not enabled_source_types:
            return {}

        embedding_start = perf_counter()
        embedding = await asyncio.to_thread(EmbeddingService.embed_query, question)
        timings["embedding_generation_ms"] = self._elapsed_ms(embedding_start)

        distance = KnowledgeChunk.embedding.cosine_distance(
            embedding).label("distance")
        candidate_limit = max(
            12,
            sum(self._lane_limit(response_profile, lane)
                for lane in LANE_SOURCE_TYPES) * 4,
        )
        query = (
            select(KnowledgeChunk, distance)
            .where(
                KnowledgeChunk.tenant_id == tenant_id,
                KnowledgeChunk.source_type.in_(enabled_source_types),
                KnowledgeChunk.status == CHUNK_STATUS_ACTIVE,
                KnowledgeChunk.deleted_at.is_(None),
                KnowledgeChunk.embedding.is_not(None),
            )
            .order_by(distance.asc())
            .limit(candidate_limit)
        )
        if site_id:
            query = query.where(
                or_(
                    KnowledgeChunk.site_ids.is_(None),
                    KnowledgeChunk.site_ids.any(site_id),
                )
            )
        else:
            query = query.where(KnowledgeChunk.site_ids.is_(None))

        retrieval_start = perf_counter()
        result = await db.execute(query)
        timings["combined_retrieval_ms"] = self._elapsed_ms(retrieval_start)

        min_relevance = PROFILE_MIN_RELEVANCE.get(response_profile, 0.45)
        grouped: dict[str, list[dict[str, Any]]] = {}
        for chunk, row_distance in result.all():
            relevance = max(0.0, 1.0 - float(row_distance or 1.0))
            if relevance < min_relevance and grouped:
                continue
            lane = SOURCE_TYPE_LANES.get(chunk.source_type)
            if not lane:
                continue
            grouped.setdefault(lane, []).append(
                self._ranked_row(
                    chunk,
                    row_distance,
                    relevance,
                    site_id,
                    response_profile,
                )
            )

        retrieved = {}
        for lane, rows in grouped.items():
            rows.sort(key=lambda row: row["rank_score"], reverse=True)
            retrieved[lane] = self._dedupe_rows(
                rows, self._lane_limit(response_profile, lane))
        return retrieved

    @staticmethod
    def _lane_limit(response_profile: str, lane: str) -> int:
        return PROFILE_LIMITS.get(response_profile, {}).get(lane, 0)

    @staticmethod
    def _ranked_row(
        chunk: KnowledgeChunk,
        row_distance: float | None,
        relevance: float,
        site_id: uuid.UUID | None,
        response_profile: str,
    ) -> dict[str, Any]:
        rank_score = relevance
        if site_id and chunk.site_ids and site_id in chunk.site_ids:
            rank_score += 0.08
        if (
            response_profile == RESPONSE_PROFILE_PRACTICAL_GUIDANCE
            and chunk.source_type == SOURCE_TYPE_KNOWLEDGE_OBJECT
        ):
            rank_score += 0.05
        if chunk.topic or chunk.task_type or chunk.asset_name:
            rank_score += 0.02
        return {
            "chunk": chunk,
            "distance": float(row_distance or 0.0),
            "relevance_score": round(relevance, 4),
            "rank_score": round(rank_score, 4),
        }

    @staticmethod
    def _dedupe_rows(rows: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
        if limit <= 0:
            return []
        deduped = []
        seen = set()
        for row in rows:
            chunk = row["chunk"]
            key = (
                chunk.source_type,
                str(chunk.source_id),
                chunk.page_number,
                chunk.section_title,
            )
            if key in seen:
                continue
            seen.add(key)
            deduped.append(row)
            if len(deduped) >= limit:
                break
        return deduped

    async def _analyze_image(
        self,
        image_path: str,
        content_type: str,
        question: str,
    ) -> str:
        api_key = (
            getattr(settings, "GEMINI_API_KEY", None)
            or getattr(settings, "GOOGLE_API_KEY", None)
        )
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="Gemini Vision is not configured",
            )

        content = await asyncio.to_thread(Path(image_path).read_bytes)
        if not content:
            raise HTTPException(
                status_code=400, detail="Uploaded image is empty")
        mime_type = content_type or "image/jpeg"
        encoded = base64.b64encode(content).decode("ascii")
        model = getattr(settings, "GEMINI_VISION_MODEL", "gemini-1.5-flash")
        prompt = (
            "Analyze this workplace safety image for hazards, visible task context, "
            "PPE, equipment state, housekeeping issues, and stop-work triggers. "
            f"User question: {question or 'No text question provided.'}"
        )
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={api_key}"
        )
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": encoded,
                            }
                        },
                    ]
                }
            ]
        }

        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(url, json=payload)

        if response.status_code >= 400:
            logger.warning(
                "gemini_vision_failed",
                extra={"status_code": response.status_code},
            )
            raise HTTPException(
                status_code=502,
                detail="Gemini Vision analysis failed",
            )
        data = response.json()
        return (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
            .strip()
        )

    @staticmethod
    def _message_type(text: str, has_image: bool) -> str:
        if text and has_image:
            return MESSAGE_TYPE_TEXT_IMAGE
        if has_image:
            return MESSAGE_TYPE_IMAGE
        return MESSAGE_TYPE_TEXT

    @staticmethod
    def _build_effective_question(text: str, image_context: str) -> str:
        if image_context:
            return (
                f"{text or 'Review this safety image.'}\n\n"
                f"Image analysis context:\n{image_context}"
            )
        return text

    @staticmethod
    def _format_history(history: list[dict[str, str]]) -> str:
        if not history:
            return "No prior messages."
        return "\n".join(
            f"{item['role']}: {item['content'][:800]}" for item in history[-8:]
        )

    @staticmethod
    def _format_rag_context(
        retrieved: dict[str, list[dict[str, Any]]],
        response_profile: str,
    ) -> str:
        blocks = []
        text_limit = 900 if response_profile in {
            RESPONSE_PROFILE_DEFINITION,
            RESPONSE_PROFILE_QUICK_ANSWER,
            RESPONSE_PROFILE_IMAGE_OBSERVATION,
        } else 1300
        for lane, rows in retrieved.items():
            lane_lines = [f"[{lane}]"]
            for idx, row in enumerate(rows, start=1):
                chunk = row["chunk"]
                lane_lines.append(
                    (
                        f"Source {idx}: type={chunk.source_type}; "
                        f"source_id={chunk.source_id}; chunk_id={chunk.id}; "
                        f"topic={chunk.topic}; task_type={chunk.task_type}; "
                        f"risk_level={chunk.risk_level}; "
                        f"relevance={row['relevance_score']}\n"
                        f"{chunk.chunk_text[:text_limit]}"
                    )
                )
            blocks.append("\n\n".join(lane_lines))
        return "\n\n---\n\n".join(blocks)

    @staticmethod
    def _policy_instructions(
        retrieval_policy: dict[str, bool],
        response_profile: str,
    ) -> str:
        disabled = [
            lane for lane, is_enabled in retrieval_policy.items() if not is_enabled
        ]
        instructions = []
        if response_profile in {
            RESPONSE_PROFILE_DEFINITION,
            RESPONSE_PROFILE_QUICK_ANSWER,
            RESPONSE_PROFILE_IMAGE_OBSERVATION,
        }:
            instructions.append(
                "Answer only the user's narrow question; stay concise.")
        if RAG_LANE_SIMILAR_INCIDENTS in disabled:
            instructions.extend(
                [
                    "Do not mention similar incidents.",
                    "Do not invent incident examples.",
                    "Do not include incident-derived lessons.",
                    "Answer only from official guidance and allowed expert knowledge.",
                ]
            )
        if RAG_LANE_EXPERT_KNOWLEDGE in disabled:
            instructions.append(
                "Do not include expert knowledge unless it appears in the allowed context."
            )
        return " ".join(instructions) or "Use all retrieved lanes according to context."

    @staticmethod
    def _output_contract(mode: str, intent: str, response_profile: str) -> str:
        if response_profile == RESPONSE_PROFILE_DEFINITION:
            return (
                "Return compact JSON only, max 120 words: "
                '{"type":"knowledge_card","status":"answered","risk_level":"low",'
                '"answer":{"summary":"short Markdown answer","steps":[],"ppe":[],'
                '"warnings":[],"stop_work_triggers":[]},"confidence_score":0.0}. '
                "Use no more than 3 bullets. Do not include incident examples."
            )
        if response_profile == RESPONSE_PROFILE_IMAGE_OBSERVATION:
            return (
                "Return compact JSON only, max 180 words: "
                '{"type":"image_safety_check","status":"answered",'
                '"risk_level":"low|medium|high|null",'
                '"answer":"direct answer to the image question",'
                '"observed_hazards":[],"skipped_safety_measures":[],'
                '"immediate_warning":null,"limitations":[],"confidence_score":0.0}. '
                "Focus on visible evidence and the user's exact question."
            )
        if response_profile == RESPONSE_PROFILE_INCIDENT_HISTORY:
            return (
                "Return compact JSON only, max 250 words: "
                '{"type":"incident_history","status":"answered","risk_level":null,'
                '"answer":"summary","matching_incidents":[],"lessons":[],'
                '"confidence_score":0.0}. Do not invent incidents.'
            )
        if response_profile == RESPONSE_PROFILE_INCIDENT_PREVENTION_BRIEF:
            return (
                "Return concise JSON only, max 350 words: "
                '{"type":"incident_prevention_brief","status":"answered","task":"...",'
                '"risk_level":"low|medium|high|null","answer":"Markdown summary",'
                '"must_verify":[],"required_ppe":[],"stop_work_triggers":[],'
                '"similar_incidents":[],"confidence_score":0.0}. '
                "Include only the most important checks."
            )
        return (
            "Return compact JSON only, max 250 words: "
            '{"type":"safety_answer","status":"answered",'
            '"risk_level":"low|medium|high|null","answer":"Markdown answer",'
            '"required_steps":[],"ppe":[],"warnings":[],"confidence_score":0.0}. '
            "Only include fields directly supported by allowed context."
        )

    @staticmethod
    def _parse_card(
        raw_answer: str,
        mode: str,
        intent: str,
        question: str,
        response_profile: str,
    ) -> dict[str, Any]:
        try:
            parsed = json.loads(raw_answer)
        except json.JSONDecodeError:
            start = raw_answer.find("{")
            end = raw_answer.rfind("}")
            if start >= 0 and end > start:
                try:
                    parsed = json.loads(raw_answer[start: end + 1])
                except json.JSONDecodeError:
                    parsed = {"answer": raw_answer}
            else:
                parsed = {"answer": raw_answer}
        if not isinstance(parsed, dict):
            parsed = {"answer": str(parsed)}

        if response_profile == RESPONSE_PROFILE_DEFINITION:
            answer = parsed.get("answer")
            if isinstance(answer, str):
                answer = {
                    "summary": answer,
                    "steps": [],
                    "ppe": [],
                    "warnings": [],
                    "stop_work_triggers": [],
                }
            elif not isinstance(answer, dict):
                answer = {
                    "summary": raw_answer,
                    "steps": [],
                    "ppe": [],
                    "warnings": [],
                    "stop_work_triggers": [],
                }
            answer.setdefault("summary", raw_answer)
            answer.setdefault("steps", [])
            answer.setdefault("ppe", [])
            answer.setdefault("warnings", [])
            answer.setdefault("stop_work_triggers", [])
            return {
                "type": parsed.get("type", "knowledge_card"),
                "status": parsed.get("status", "answered"),
                "risk_level": parsed.get("risk_level", "low"),
                "answer": answer,
                "sources": parsed.get("sources", []),
                "confidence_score": parsed.get("confidence_score", 0.0),
            }

        if response_profile == RESPONSE_PROFILE_IMAGE_OBSERVATION:
            parsed.setdefault("type", "image_safety_check")
            parsed.setdefault("status", "answered")
            parsed.setdefault("risk_level", None)
            parsed.setdefault("answer", raw_answer)
            parsed.setdefault("observed_hazards", [])
            parsed.setdefault("skipped_safety_measures", [])
            parsed.setdefault("limitations", [])
            parsed.setdefault("confidence_score", 0.0)
            if parsed.get("immediate_warning"):
                parsed.setdefault("warnings", [parsed["immediate_warning"]])
            return parsed

        if response_profile == RESPONSE_PROFILE_INCIDENT_HISTORY:
            parsed.setdefault("type", "incident_history")
            parsed.setdefault("status", "answered")
            parsed.setdefault("answer", raw_answer)
            parsed.setdefault("matching_incidents", [])
            parsed.setdefault("lessons", [])
            parsed.setdefault("risk_level", None)
            parsed.setdefault("confidence_score", 0.0)
            return parsed

        parsed.setdefault("type", "incident_prevention_brief" if mode ==
                          CHAT_MODE_INCIDENT_PREVENTION else "safety_answer")
        parsed.setdefault("status", "answered")
        parsed.setdefault("answer", raw_answer)
        parsed.setdefault("risk_level", None)
        parsed.setdefault("sources", [])
        parsed.setdefault("confidence_score", 0.0)
        if mode == CHAT_MODE_INCIDENT_PREVENTION:
            parsed.setdefault("task", question[:160])
            parsed.setdefault("must_verify", [])
            parsed.setdefault("required_ppe", [])
            parsed.setdefault("stop_work_triggers", [])
            parsed.setdefault("common_mistakes", [])
            parsed.setdefault("similar_incidents", [])
        return parsed

    @staticmethod
    def _attach_sources(
        card: dict[str, Any],
        citations: list[dict[str, Any]],
        mode: str,
        intent: str,
    ) -> None:
        card["citations"] = citations
        card.pop("sources", None)

    @staticmethod
    def _sanitize_card_for_policy(
        card: dict[str, Any],
        mode: str,
        retrieval_policy: dict[str, bool],
    ) -> dict[str, Any]:
        if mode == CHAT_MODE_INCIDENT_PREVENTION:
            return card
        if retrieval_policy.get(RAG_LANE_SIMILAR_INCIDENTS, False):
            return card

        sanitized = dict(card)
        for key in ("similar_incidents", "common_mistakes", "must_verify"):
            sanitized.pop(key, None)
        return sanitized

    @staticmethod
    def _answer_text(card: dict[str, Any], raw_answer: str) -> str:
        answer = card.get("answer")
        if isinstance(answer, dict):
            return str(answer.get("summary") or raw_answer).strip()
        return str(answer or raw_answer).strip()

    @staticmethod
    def _build_citations(
        retrieved: dict[str, list[dict[str, Any]]],
        max_citations: int = 3,
    ) -> list[dict[str, Any]]:
        citations = []
        seen = set()
        for lane, rows in retrieved.items():
            for row in rows:
                chunk = row["chunk"]
                key = (chunk.source_type, str(
                    chunk.source_id), chunk.page_number)
                if key in seen:
                    continue
                seen.add(key)
                citations.append(
                    {
                        "id": f"{lane}:{chunk.id}",
                        "lane": lane,
                        "source_type": chunk.source_type,
                        "source_id": str(chunk.source_id),
                        "chunk_id": str(chunk.id),
                        "title": (
                            getattr(chunk, "document_title", None)
                            or chunk.topic
                            or chunk.task_type
                            or chunk.asset_name
                        ),
                        "section_title": chunk.section_title,
                        "page_number": chunk.page_number,
                        "relevance_score": row["relevance_score"],
                        "confidence_score": (
                            float(chunk.confidence_score)
                            if chunk.confidence_score is not None
                            else None
                        ),
                    }
                )
                if len(citations) >= max_citations:
                    return citations
        return citations

    @staticmethod
    def _serialize_retrieved(
        retrieved: dict[str, list[dict[str, Any]]],
    ) -> dict[str, list[dict[str, Any]]]:
        serialized = {}
        for lane, rows in retrieved.items():
            serialized[lane] = []
            for row in rows:
                chunk = row["chunk"]
                serialized[lane].append(
                    {
                        "chunk_id": str(chunk.id),
                        "source_type": chunk.source_type,
                        "source_id": str(chunk.source_id),
                        "topic": chunk.topic,
                        "task_type": chunk.task_type,
                        "asset_name": chunk.asset_name,
                        "risk_level": chunk.risk_level,
                        "relevance_score": row["relevance_score"],
                    }
                )
        return serialized

    @staticmethod
    def _build_rag_metadata(
        *,
        mode: str,
        intent: str,
        response_profile: str,
        citations: list[dict[str, Any]],
        card: dict[str, Any],
        retrieval_policy: dict[str, bool],
        retrieved: dict[str, list[dict[str, Any]]],
        image_context: str,
    ) -> dict[str, Any]:
        metadata = {
            "mode": mode,
            "intent": intent,
            "response_profile": response_profile,
            "citations": citations,
            "card": card,
        }
        if getattr(settings, "DEBUG_CHAT_RAG", False):
            metadata["debug"] = {
                "retrieval_policy": retrieval_policy,
                "lanes": ChatRAGService._serialize_retrieved(retrieved),
                "image_context": image_context or None,
            }
        return metadata

    @staticmethod
    def _confidence(card: dict[str, Any], citations: list[dict[str, Any]]) -> float:
        model_score = card.get("confidence_score")
        try:
            score = float(model_score)
        except (TypeError, ValueError):
            score = 0.0
        if citations:
            score = max(score, min(0.95, 0.45 + len(citations) * 0.05))
        return round(max(0.0, min(score, 1.0)), 3)

    @staticmethod
    def _elapsed_ms(start: float) -> float:
        return round((perf_counter() - start) * 1000, 2)

    @staticmethod
    def _log_timing(
        event: str,
        *,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        tenant_id: uuid.UUID,
        mode: str,
        has_image: bool,
        timings: dict[str, float],
    ) -> None:
        logger.info(
            event,
            extra={
                "session_id": str(session_id),
                "user_id": str(user_id),
                "tenant_id": str(tenant_id),
                "mode": mode,
                "has_image": has_image,
                "timings": timings,
            },
        )

    @staticmethod
    def _title_from_message(message: str) -> str:
        title = " ".join(message.split())[:80]
        return title or "New safety chat"

    @staticmethod
    async def _emit(
        session_id: uuid.UUID,
        event: SocketEvents,
        message_id: uuid.UUID,
        status: str,
        extra: dict[str, Any] | None = None,
    ) -> None:
        data = {
            "session_id": str(session_id),
            "message_id": str(message_id),
            "status": status,
        }
        label, progress = SOCKET_STATUS_META.get(
            status,
            (status.replace("_", " "), None),
        )
        data["label"] = label
        if progress is not None:
            data["progress"] = progress
        if extra:
            data.update(extra)
        await socket_manager.emit_to_session(
            str(session_id),
            event,
            jsonable_encoder(data),
        )


chat_rag_service = ChatRAGService()
