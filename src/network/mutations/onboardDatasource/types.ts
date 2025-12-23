export interface OnboardDatasourceRequest {
  name: string;
  type_id: number;
  config: Record<string, any>;
}

export interface OnboardDatasourceResponse {
  id: number;
  name: string;
  type_id: number;
  type?: string;
  config: Record<string, any>;
  status?: string;
  created_at?: number;
  created_by?: string;
}

