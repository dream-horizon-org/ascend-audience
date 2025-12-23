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
    [key: string]: any;
  };
  status: string;
  createdBy: string;
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
    rules: any[]; // Can be typed more specifically if needed
  };
}

export interface AudienceDetailsParsed {
  audienceMeta: AudienceMeta;
  sinks: AudienceSink[];
  rules: any[];
}

