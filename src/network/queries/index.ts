/**
 * Queries index file
 * Central export point for all queries
 */

// Shared keys (used by mutations for cache invalidation)
export { audienceKeys } from "./sharedKeys";

// Get Audiences List
export { fetchAudiencesList, useAudiencesList } from "./getAudiencesList";
export type { AudienceListItem, GetAudiencesListParsed, GetAudiencesListParams } from "./getAudiencesList";

// Get Datasinks
export { fetchDatasinks, useDatasinks } from "./getDatasinks";
export type { Datasink, GetDatasinksParsed, GetDatasinksParams } from "./getDatasinks/types";
