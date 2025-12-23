export interface ConnectorTypeProperty {
  type: string;
  description?: string;
  default?: any;
  enum?: string[];
  additionalProperties?: {
    type: string;
  };
}

export interface ConnectorTypeConfigSchema {
  type: string;
  required: string[];
  properties: {
    [key: string]: ConnectorTypeProperty;
  };
}

export interface ConnectorType {
  id: number;
  kind: "SINK" | "SOURCE";
  type: string;
  displayName: string;
  configSchema: ConnectorTypeConfigSchema;
  active: boolean;
}

export interface GetConnectorTypesAPIResponse {
  data: ConnectorType[];
}

export interface GetConnectorTypesParams {
  kind: "SINK" | "SOURCE";
}

