export interface AudienceListItem {
  audience_id: number;
  name: string;
  description: string;
  type: "STATIC" | "CONDITIONAL";
  verified: boolean;
  user_count: number;
  rule_count: number;
  expire_date: number;
  created_at: number;
  updated_at: number;
  created_by: string;
}

export interface GetAudiencesListParsed {
  audiences: AudienceListItem[];
  hasMore: boolean;
}

export interface GetAudiencesListAPIResponse {
  data: {
    page_info: {
      page: number;
      page_size: number;
      has_more: boolean;
    };
    data: AudienceListItem[];
  };
}

export interface GetAudiencesListParams {
  pageSize: number;
  page: number;
  nameSearch?: string;
  createdBy?: string;
  verified?: boolean;
}

