export interface AddRuleRequest {
  name: string;
  description: string;
  start_time: number; // Unix timestamp in seconds
  end_time: number; // Unix timestamp in seconds
  rule_type: string;
  rule_action: string;
  configuration: {
    configuration_type: string;
    source: {
      id: number;
    };
    query: string;
  };
}

export interface AddRulePayload {
  rules: AddRuleRequest[];
}

export interface AddRuleAPIResponse {
  message?: string;
  data?: unknown;
}

export interface AddRuleMutationParams {
  audienceId: string;
  data: AddRulePayload;
}

