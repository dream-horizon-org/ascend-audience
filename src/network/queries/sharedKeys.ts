/**
 * Shared query keys for React Query
 * Used by both queries and mutations for cache management
 */

export const audienceKeys = {
  all: ["audiences"] as const,
  lists: () => [...audienceKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...audienceKeys.lists(), filters] as const,
};
