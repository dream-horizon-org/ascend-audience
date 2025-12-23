import { GetDatasinksAPIResponse, GetDatasinksParsed } from "./types";

export const parseGetDatasinks = (
  response: GetDatasinksAPIResponse
): GetDatasinksParsed => {
  // Extract data from nested structure
  const datasinks = response?.data?.data || [];
  const hasMore = response?.data?.page_info?.has_more || false;

  return {
    datasinks,
    hasMore,
  };
};

