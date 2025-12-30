import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { SERVICE_NAME } from "../../../utils/contants";
import { audienceKeys } from "../../queries/sharedKeys";
import type {
  AddRuleMutationParams,
  AddRuleAPIResponse,
} from "./types";

const addRule = async ({
  audienceId,
  data,
}: AddRuleMutationParams): Promise<AddRuleAPIResponse> => {
  const response = await api.post<AddRuleAPIResponse>(
    `/audiences/${audienceId}/rules`,
    data,
    {
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );
  return response.data;
};

export const useAddRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRule,
    onSuccess: (_data, variables) => {
      // Invalidate the audience details query to refetch the updated rules
      queryClient.invalidateQueries({
        queryKey: audienceKeys.details(variables.audienceId),
      });
    },
  });
};

