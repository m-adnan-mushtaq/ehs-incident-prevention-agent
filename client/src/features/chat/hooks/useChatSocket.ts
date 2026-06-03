import { TOKEN_PREFIX } from "@/constants/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { IChatFinalResponse, IChatSocketPayload } from "@/types/chat";
import { CHAT_SOCKET_EVENTS } from "../utils/chat.constants";
import { getApiOrigin } from "../utils/chat-formatters";
import {
  chatLiveReducer,
  initialChatLiveState,
  type ChatLiveAction,
  type IChatLiveState,
} from "../utils/chat-event-reducer";

type SocketHandlers = {
  onProgress?: (payload: IChatSocketPayload) => void;
  onToolStatus?: (payload: IChatSocketPayload) => void;
  onFinal?: (payload: IChatFinalResponse) => void;
  onError?: (message: string) => void;
  onLegacyEvent?: (event: string, payload: IChatSocketPayload) => void;
};

let sharedSocket: Socket | null = null;

const getSocket = (): Socket => {
  if (!sharedSocket) {
    const token = localStorage.getItem(TOKEN_PREFIX);
    sharedSocket = io(getApiOrigin(), {
      path: "/socket.io/",
      transports: ["websocket"],
      withCredentials: true,
      auth: token ? { token } : undefined,
    });
  }
  return sharedSocket;
};

export const useChatSocket = (
  sessionId: string | null,
  handlers: SocketHandlers = {}
) => {
  const [connected, setConnected] = useState(false);
  const [liveState, dispatchLive] = useState<IChatLiveState>(initialChatLiveState);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const dispatch = useCallback((action: ChatLiveAction) => {
    dispatchLive((prev) => chatLiveReducer(prev, action));
  }, []);

  useEffect(() => {
    if (!sessionId) {
      dispatch({ type: "reset" });
      return;
    }

    const socket = getSocket();
    dispatch({ type: "reset" });

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const emitJoin = () => {
      socket.emit(CHAT_SOCKET_EVENTS.JOIN_CHAT_ROOM, { session_id: sessionId });
    };

    const wrap = (event: string, raw: IChatSocketPayload) => {
      dispatch({ type: "socket_event", event, payload: raw });
      handlersRef.current.onLegacyEvent?.(event, raw);
    };

    const onProgress = (...args: unknown[]) => {
      const raw = args[0] as IChatSocketPayload;
      wrap(CHAT_SOCKET_EVENTS.CHAT_PROGRESS, raw);
      handlersRef.current.onProgress?.(raw);
      if (raw.user_message_id) {
        dispatch({
          type: "attach_turn",
          userMessageId: raw.user_message_id,
          assistantMessageId: raw.message_id ?? null,
        });
      }
    };

    const onTool = (...args: unknown[]) => {
      const raw = args[0] as IChatSocketPayload;
      wrap(CHAT_SOCKET_EVENTS.CHAT_TOOL_STATUS, raw);
      handlersRef.current.onToolStatus?.(raw);
    };

    const onFinal = (...args: unknown[]) => {
      const raw = args[0] as IChatFinalResponse & IChatSocketPayload;
      if (raw.assistant_message_id) {
        dispatch({ type: "final", response: raw });
        handlersRef.current.onFinal?.(raw);
      } else {
        wrap(CHAT_SOCKET_EVENTS.CHAT_FINAL, raw);
      }
    };

    const onError = (...args: unknown[]) => {
      const raw = args[0] as IChatSocketPayload;
      const msg =
        raw.error ??
        (typeof raw.data === "object" && raw.data && "error" in raw.data
          ? String((raw.data as { error?: string }).error)
          : "Safety check failed");
      dispatch({ type: "error", message: msg });
      handlersRef.current.onError?.(msg);
      wrap(CHAT_SOCKET_EVENTS.CHAT_ERROR, raw);
    };

    const legacy = [
      CHAT_SOCKET_EVENTS.CHAT_MESSAGE_CREATED,
      CHAT_SOCKET_EVENTS.CHAT_THINKING,
      CHAT_SOCKET_EVENTS.CHAT_TOOL_START,
      CHAT_SOCKET_EVENTS.CHAT_TOOL_RESULT,
      CHAT_SOCKET_EVENTS.CHAT_TOKEN,
    ] as const;

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(CHAT_SOCKET_EVENTS.CHAT_PROGRESS, onProgress);
    socket.on(CHAT_SOCKET_EVENTS.CHAT_TOOL_STATUS, onTool);
    socket.on(CHAT_SOCKET_EVENTS.CHAT_FINAL, onFinal);
    socket.on(CHAT_SOCKET_EVENTS.CHAT_ERROR, onError);
    legacy.forEach((ev) =>
      socket.on(ev, (...args: unknown[]) => wrap(ev, args[0] as IChatSocketPayload))
    );

    if (socket.connected) {
      setConnected(true);
      emitJoin();
    } else {
      socket.connect();
      socket.once("connect", emitJoin);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(CHAT_SOCKET_EVENTS.CHAT_PROGRESS, onProgress);
      socket.off(CHAT_SOCKET_EVENTS.CHAT_TOOL_STATUS, onTool);
      socket.off(CHAT_SOCKET_EVENTS.CHAT_FINAL, onFinal);
      socket.off(CHAT_SOCKET_EVENTS.CHAT_ERROR, onError);
      legacy.forEach((ev) => socket.off(ev));
    };
  }, [sessionId, dispatch]);

  return { connected, liveState, dispatchLive: dispatch };
};
