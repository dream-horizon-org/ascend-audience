import { GetAudiencesListAPIResponse, GetAudiencesListParsed } from "./types";

export const parseGetAudiencesList = (
  response: GetAudiencesListAPIResponse
): GetAudiencesListParsed => {
  // Extract data from nested structure
  const audiences = response?.data?.data || [];
  const hasMore = response?.data?.page_info?.has_more || false;

  return {
    audiences,
    hasMore,
  };
};

