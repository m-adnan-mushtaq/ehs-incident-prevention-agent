export interface IRole {
  id: string;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: string | null;
}
