// Filter params for audiences list API
export interface AudienceFilters {
  pageSize?: number;
  page?: number;
  nameSearch?: string;
  createdBy?: string;
  verified?: boolean;
  tag?: string; // Comma-separated tag values
  status?: string; // Comma-separated status values
}

// Individual Audience Type
export interface Audience {
  audienceId: string;
  name: string;
  status: string;
  tags: string[];
  updatedAt: string;
  createdBy?: string;
  verified?: boolean;
  projectKey?: string;
}

// Pagination Type
export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Response Types
export interface AudiencesResponse {
  audiences: Audience[];
  pagination: Pagination;
}
