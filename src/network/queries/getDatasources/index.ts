import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { parseGetDatasources } from "./parser";
import {
  GetDatasourcesAPIResponse,
  GetDatasourcesParsed,
  GetDatasourcesParams,
} from "./types";

export const fetchDatasources = async (
  params: GetDatasourcesParams
): Promise<GetDatasourcesParsed> => {
  const { pageSize, pageNum } = params;

  const queryParams: Record<string, string | number> = {
    pageSize,
    pageNum,
  };

  const response = await api.get<GetDatasourcesAPIResponse>(
    endpoints.datasources.list,
    {
      params: queryParams,
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );
  return parseGetDatasources(response.data);
};

export const useDatasources = (pageSize: number = 10) => {
  return useInfiniteQuery<GetDatasourcesParsed, Error>({
    queryKey: ["datasources", pageSize],
    queryFn: ({ pageParam = 0 }) =>
      fetchDatasources({
        pageSize,
        pageNum: pageParam as number,
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

