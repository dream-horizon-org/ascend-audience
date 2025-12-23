import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { parseGetDatasinks } from "./parser";
import {
  GetDatasinksAPIResponse,
  GetDatasinksParsed,
  GetDatasinksParams,
} from "./types";

export const fetchDatasinks = async (
  params: GetDatasinksParams
): Promise<GetDatasinksParsed> => {
  const { pageSize, pageNum } = params;

  const response = await api.get<GetDatasinksAPIResponse>(
    endpoints.datasinks.list,
    {
      params: {
        pageSize,
        pageNum,
      },
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );

  return parseGetDatasinks(response.data);
};

export const useDatasinks = (pageSize: number = 10) => {
  return useInfiniteQuery<GetDatasinksParsed, Error>({
    queryKey: ["datasinks", pageSize],
    queryFn: ({ pageParam = 0 }) =>
      fetchDatasinks({
        pageSize,
        pageNum: pageParam as number,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length; // Next page number
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

