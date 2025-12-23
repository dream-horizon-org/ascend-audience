export interface CreateAudienceRequest {
  name: string;
  description: string;
  sink_ids: number[];
  expire_date: number;
  type: "CONDITIONAL";
}

export interface CreateAudienceResponse {
  id: number;
  name: string;
  description: string;
  sink_ids: number[];
  expire_date: number;
  type: string;
  status?: string;
  created_at?: number;
  created_by?: string;
}

