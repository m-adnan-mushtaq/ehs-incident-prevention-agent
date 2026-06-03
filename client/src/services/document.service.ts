export type IDocument = {
  id: string;
  title: string;
  version: number;
  category: string;
  department: string;
  status: "draft" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  subRows?: IDocument[];
};
