import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { CreateAudienceRequest, CreateAudienceResponse } from "./types";

export const createAudience = async (
  data: CreateAudienceRequest
): Promise<CreateAudienceResponse> => {
  const response = await api.post<CreateAudienceResponse>(
    endpoints.audiences.create,
    data,
    {
      headers: {
        service: SERVICE_NAME.AUDIENCE,
        // email: "system", // TODO: Add to backend CORS allowed headers
      },
    }
  );

  return response.data;
};

export const useCreateAudience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAudience,
    onSuccess: () => {
      // Invalidate audiences list to refetch
      queryClient.invalidateQueries({ queryKey: ["audiences"] });
    },
  });
};

export type { CreateAudienceRequest, CreateAudienceResponse };
