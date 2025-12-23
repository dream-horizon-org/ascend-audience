import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { parseGetAudiencesList } from "./parser";
import {
  GetAudiencesListAPIResponse,
  GetAudiencesListParsed,
  GetAudiencesListParams,
} from "./types";

export const fetchAudiencesList = async (
  params: GetAudiencesListParams
): Promise<GetAudiencesListParsed> => {
  const { pageSize, page, nameSearch, createdBy, verified } = params;

  const queryParams: Record<string, string | number | boolean> = {
    pageSize,
    page,
  };

  // Add optional filters
  if (nameSearch) queryParams.nameSearch = nameSearch;
  if (createdBy) queryParams.createdBy = createdBy;
  if (verified !== undefined) queryParams.verified = verified;

  const response = await api.get<GetAudiencesListAPIResponse>(
    endpoints.audiences.list,
    {
      params: queryParams,
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );

  return parseGetAudiencesList(response.data);
};

export const useAudiencesList = (
  pageSize: number = 10,
  nameSearch?: string,
  createdBy?: string,
  verified?: boolean
) => {
  return useInfiniteQuery<GetAudiencesListParsed, Error>({
    queryKey: ["audiences-list", pageSize, nameSearch, createdBy, verified],
    queryFn: ({ pageParam = 0 }) =>
      fetchAudiencesList({
        pageSize,
        page: pageParam as number,
        nameSearch,
        createdBy,
        verified,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export type { AudienceListItem, GetAudiencesListParsed, GetAudiencesListParams } from "./types";

