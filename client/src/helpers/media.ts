import { MEDIA_BASE_URL } from "@/constants/common";
import type { IDocument } from "@/types/document";

const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export const getMediaUrl = (key?: string | null): string | null => {
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  return joinUrl(MEDIA_BASE_URL, key);
};

export const getDocumentUrl = (document?: IDocument | null): string | null =>
  getMediaUrl(document?.file_url);

export const getChatImageUrl = (imageKey?: string | null): string | null =>
  getMediaUrl(imageKey);
