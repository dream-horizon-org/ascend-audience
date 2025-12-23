import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClient";
import { endpoints } from "../../endpoints";
import { SERVICE_NAME } from "../../../utils/contants";
import {
  GetConnectorTypesAPIResponse,
  GetConnectorTypesParams,
  ConnectorType,
} from "./types";

export const fetchConnectorTypes = async (
  params: GetConnectorTypesParams
): Promise<ConnectorType[]> => {
  const response = await api.get<GetConnectorTypesAPIResponse>(
    endpoints.connectorTypes.list,
    {
      params: { kind: params.kind },
      headers: { service: SERVICE_NAME.AUDIENCE },
    }
  );
  return response.data.data || [];
};

export const useConnectorTypes = (kind: "SINK" | "SOURCE") => {
  return useQuery<ConnectorType[], Error>({
    queryKey: ["connectorTypes", kind],
    queryFn: () => fetchConnectorTypes({ kind }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

