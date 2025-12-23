export interface OnboardDatasinkRequest {
  name: string;
  type_id: number;
  config: Record<string, any>;
}

export interface OnboardDatasinkResponse {
  id: number;
  name: string;
  type_id: number;
  type?: string;
  config: Record<string, any>;
  status?: string;
  created_at?: number;
  created_by?: string;
}

