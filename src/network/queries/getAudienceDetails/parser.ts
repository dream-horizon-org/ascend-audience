import { AudienceDetailsAPIResponse, AudienceDetailsParsed } from "./types";

export const parseGetAudienceDetails = (
  response: AudienceDetailsAPIResponse
): AudienceDetailsParsed => {
  const audienceMeta = response?.data?.audience_meta;
  const sinks = response?.data?.sinks || [];
  const rules = response?.data?.rules || [];

  return {
    audienceMeta,
    sinks,
    rules,
  };
};

