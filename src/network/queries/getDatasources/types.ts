export interface Datasource {
  id: number;
  name: string;
  type?: string;
  status?: string;
}

export interface GetDatasourcesParsed {
  datasources: Datasource[];
  hasMore: boolean;
}

export interface GetDatasourcesAPIResponse {
  data: {
    page_info: {
      page: number;
      page_size: number;
      has_more: boolean;
    };
    data: Datasource[];
  };
}

export interface GetDatasourcesParams {
  pageSize: number;
  pageNum: number;
}

