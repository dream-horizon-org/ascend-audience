export interface CreateAudienceRequest {
  name: string;
  description: string;
  sink_ids: number[];
  expire_date: number;
  type: "CONDITIONAL" | "STATIC";
}

export interface CreateAudienceResponse {
  data: number; // The new audience ID
}

