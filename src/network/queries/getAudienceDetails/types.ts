export interface AudienceSink {
  id: number;
  name: string;
  typeId: number;
  type: string;
  config: {
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
    folderPath?: string;
    connectorType?: string;
    [key: string]: unknown;
  };
  status: string;
  createdBy: string;
}

export interface DataSource {
  id: number;
  name: string;
  typeId: number;
  type: string;
  config: {
    [key: string]: unknown;
  };
  status: string;
  createdBy: string;
}

export interface AudienceRule {
  ruleId: number;
  audienceId: number;
  name: string;
  description: string;
  startTime: number; // Unix timestamp in seconds
  endTime: number; // Unix timestamp in seconds
  ruleAction: string;
  ruleType: string;
  status: string;
  configuration: {
    configuration_type: string;
    source: {
      id: number;
      details: DataSource;
    };
    query?: string;
    [key: string]: unknown;
  };
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  xprojectId: string;
}

export interface AudienceMeta {
  audienceId: number;
  name: string;
  description: string;
  type: string;
  sinks: number[];
  verified: boolean;
  userCount: number;
  expireDate: number; // Unix timestamp in seconds
  lastAudienceUpdatedAt: number; // Unix timestamp in seconds
  createdAt: number; // Unix timestamp in seconds
  updatedAt: number; // Unix timestamp in seconds
  createdBy: string;
  xprojectId: string;
}

export interface AudienceDetailsAPIResponse {
  data: {
    audience_meta: AudienceMeta;
    sinks: AudienceSink[];
    rules: AudienceRule[];
  };
}

export interface AudienceDetailsParsed {
  audienceMeta: AudienceMeta;
  sinks: AudienceSink[];
  rules: AudienceRule[];
}

