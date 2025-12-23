import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { OnboardDatasinkRequest, OnboardDatasinkResponse } from "./types";

export const onboardDatasink = async (
  data: OnboardDatasinkRequest
): Promise<OnboardDatasinkResponse> => {
  const response = await api.post<OnboardDatasinkResponse>(
    endpoints.datasinks.onboard,
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

export const useOnboardDatasink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardDatasink,
    onSuccess: () => {
      // Invalidate datasinks list to refetch
      queryClient.invalidateQueries({ queryKey: ["datasinks"] });
    },
  });
};

export type { OnboardDatasinkRequest, OnboardDatasinkResponse };

