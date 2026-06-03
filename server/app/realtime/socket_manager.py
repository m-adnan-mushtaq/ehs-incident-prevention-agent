from enum import StrEnum
from typing import Any

import socketio


class SocketEvents(StrEnum):
    JOIN_CHAT_ROOM = "join_chat_room"
    CHAT_PROGRESS = "chat_progress"
    CHAT_TOOL_STATUS = "chat_tool_status"
    CHAT_FINAL = "chat_final"
    CHAT_ERROR = "chat_error"


class SocketManager:
    def __init__(self):
        self._sio = socketio.AsyncServer(
            async_mode="asgi",
            cors_allowed_origins="*",
        )
        self.app = socketio.ASGIApp(self._sio)
        self._register_handlers()

    def _register_handlers(self) -> None:
        @self._sio.event
        async def connect(sid, environ, auth=None):
            return True

        @self._sio.on(SocketEvents.JOIN_CHAT_ROOM.value)
        async def join_chat_room(sid, data):
            session_id = str((data or {}).get("session_id") or "")
            if session_id:
                await self._sio.enter_room(sid, self._room(session_id))

    async def emit_to_session(
        self,
        session_id: str,
        event: str | SocketEvents,
        data: dict[str, Any],
    ) -> None:
        event_name = event.value if isinstance(event, SocketEvents) else event
        await self._sio.emit(event_name, data, room=self._room(session_id))

    @staticmethod
    def _room(session_id: str) -> str:
        return f"chat:{session_id}"


socket_manager = SocketManager()
