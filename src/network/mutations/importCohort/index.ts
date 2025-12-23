import { useMutation } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import { ImportCohortRequest, ImportCohortResponse } from "./types";

// Mutation function
export const importCohort = async (
  audienceId: string | number,
  data: ImportCohortRequest,
): Promise<ImportCohortResponse> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("fileName", data.fileName);

  const url = endpoints.audiences.import(audienceId);

  const response = await api.post<ImportCohortResponse>(url, formData, {
    headers: {
      service: SERVICE_NAME.AUDIENCE,
      "Content-Type": "multipart/form-data",
      // email: "audienceui", // Removed to avoid CORS - not in backend's allowed headers list
    },
  });

  return response.data;
};

// React Query mutation hook
export const useImportCohort = () => {
  return useMutation<
    ImportCohortResponse,
    Error,
    { audienceId: string | number; data: ImportCohortRequest }
  >({
    mutationFn: ({ audienceId, data }) => importCohort(audienceId, data),
  });
};

export type { ImportCohortRequest, ImportCohortResponse };

