/**
 * Queries index file
 * Central export point for all queries
 */

// Shared keys (used by mutations for cache invalidation)
export { audienceKeys } from "./sharedKeys";

// Get Audiences List
export { fetchAudiencesList, useAudiencesList } from "./getAudiencesList";
export type { AudienceListItem, GetAudiencesListParsed, GetAudiencesListParams } from "./getAudiencesList";

// Get Audience Details
export { fetchAudienceDetails, useAudienceDetails } from "./getAudienceDetails";
export type { AudienceMeta, AudienceSink, AudienceDetailsParsed } from "./getAudienceDetails/types";

// Get Datasinks
export { fetchDatasinks, useDatasinks } from "./getDatasinks";
export type { Datasink, GetDatasinksParsed, GetDatasinksParams } from "./getDatasinks/types";

// Get Datasources
export { fetchDatasources, useDatasources } from "./getDatasources";
export type { Datasource, GetDatasourcesParsed, GetDatasourcesParams } from "./getDatasources/types";

// Get Connector Types
export { fetchConnectorTypes, useConnectorTypes } from "./getConnectorTypes";
export type { ConnectorType, ConnectorTypeConfigSchema, ConnectorTypeProperty, GetConnectorTypesParams } from "./getConnectorTypes/types";
