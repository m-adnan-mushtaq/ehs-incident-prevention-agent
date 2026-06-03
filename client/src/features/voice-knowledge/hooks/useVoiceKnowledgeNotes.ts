import { CACHE_KEYS } from "@/constants/common";
import { knowledgeObjectsService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { VOICE_SOURCE_TYPE } from "../utils/voiceKnowledge.constants";

export const useVoiceKnowledgeNotes = (page = 1, limit = 10) =>
  useQuery({
    queryKey: [...CACHE_KEYS.voiceKnowledge.paginated({ page, limit })],
    queryFn: () =>
      knowledgeObjectsService.getPaginatedKnowledgeObjects({
        page,
        page_size: limit,
        source_type: VOICE_SOURCE_TYPE,
      }),
  });
