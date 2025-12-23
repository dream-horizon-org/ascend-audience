export interface Datasink {
  id: number;
  name: string;
  type?: string;
  typeId?: number;
  status?: string;
  createdBy?: string;
  config?: Record<string, any>;
}

export interface GetDatasinksParsed {
  datasinks: Datasink[];
  hasMore: boolean;
}

export interface GetDatasinksAPIResponse {
  data: {
    page_info: {
      page: number;
      page_size: number;
      has_more: boolean;
    };
    data: Datasink[];
  };
}

export interface GetDatasinksParams {
  pageSize: number;
  pageNum: number;
}

