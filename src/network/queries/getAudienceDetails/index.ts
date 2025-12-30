import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { audienceKeys } from "../sharedKeys";
import { parseGetAudienceDetails } from "./parser";
import {
  AudienceDetailsAPIResponse,
  AudienceDetailsParsed,
} from "./types";

export const fetchAudienceDetails = async (
  audienceId: string | number
): Promise<AudienceDetailsParsed> => {
  const response = await api.get<AudienceDetailsAPIResponse>(
    endpoints.audiences.details(audienceId),
    {
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );
  return parseGetAudienceDetails(response.data);
};

export const useAudienceDetails = (audienceId: string | number) => {
  return useQuery<AudienceDetailsParsed, Error>({
    queryKey: audienceKeys.details(audienceId),
    queryFn: () => fetchAudienceDetails(audienceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!audienceId, // Only fetch if audienceId is provided
  });
};

