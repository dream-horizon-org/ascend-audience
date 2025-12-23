import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { OnboardDatasourceRequest, OnboardDatasourceResponse } from "./types";

export const onboardDatasource = async (
  data: OnboardDatasourceRequest
): Promise<OnboardDatasourceResponse> => {
  const response = await api.post<OnboardDatasourceResponse>(
    endpoints.datasources.onboard,
    data,
    {
      headers: {
        service: SERVICE_NAME.AUDIENCE,
        email: "audienceui",
      },
    }
  );

  return response.data;
};

export const useOnboardDatasource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardDatasource,
    onSuccess: () => {
      // Invalidate datasources list to refetch
      queryClient.invalidateQueries({ queryKey: ["datasources"] });
    },
  });
};

export type { OnboardDatasourceRequest, OnboardDatasourceResponse };

