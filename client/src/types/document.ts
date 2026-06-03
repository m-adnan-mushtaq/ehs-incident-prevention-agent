export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "archived"
  | "failed";

export type SourceScope = "global" | "site";

export interface IDocument {
  id: string;
  title: string;
  description?: string | null;
  file_name?: string | null;
  file_url?: string;
  file_type?: string | null;
  source_scope: SourceScope | string;
  document_type?: string | null;
  topic?: string | null;
  version?: string | null;
  status: DocumentStatus | string;
  processing_error?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface IUploadDocumentPayload {
  title: string;
  source_scope: SourceScope;
  description?: string;
  document_type?: string;
  topic?: string;
  version?: string;
  site_ids?: string;
  file: File;
}

export interface IUpdateDocumentPayload {
  title?: string;
  description?: string;
  source_scope?: SourceScope;
  document_type?: string;
  topic?: string;
  status?: DocumentStatus;
}
