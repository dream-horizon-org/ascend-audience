/**
 * Queries index file
 * Central export point for all queries
 */

// Shared keys (used by mutations for cache invalidation)
export { audienceKeys } from "./sharedKeys";

// Get Audiences List (Reference Example)
export { fetchAudiences, useAudiences } from "./getAudiences";
export type { AudiencesResponse, AudienceFilters, Audience } from "./getAudiences";

// Get Tags
export { fetchTags, useTags } from "./getTags";
