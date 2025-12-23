import { GetDatasourcesAPIResponse, GetDatasourcesParsed } from "./types";

export const parseGetDatasources = (
  response: GetDatasourcesAPIResponse
): GetDatasourcesParsed => {
  const datasources = response?.data?.data || [];
  const hasMore = response?.data?.page_info?.has_more || false;

  return {
    datasources,
    hasMore,
  };
};

