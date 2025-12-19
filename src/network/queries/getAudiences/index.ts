import { useQuery } from "@tanstack/react-query";
import { audienceKeys } from "../sharedKeys";
import type { AudiencesResponse, AudienceFilters, Audience } from "./types";

// Dummy data for audiences
const DUMMY_AUDIENCES: Audience[] = Array.from({ length: 50 }, (_, i) => ({
  audienceId: `AUD-${String(i + 1).padStart(5, "0")}`,
  name: `Audience ${i + 1} - ${["High Value Users", "New Signups", "Churned Users", "Active Subscribers", "Trial Users"][i % 5]}`,
  status: ["LIVE", "PAUSED", "CONCLUDED", "TERMINATED"][i % 4],
  tags: [
    ["marketing", "high-value"],
    ["onboarding", "new-users"],
    ["retention", "at-risk"],
    ["premium", "subscribers"],
    ["trial", "conversion"],
  ][i % 5],
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdBy: ["john.doe", "jane.smith", "bob.johnson"][i % 3],
  verified: i % 3 === 0,
  projectKey: "my-project",
}));

export const fetchAudiences = async (
  params?: AudienceFilters,
): Promise<AudiencesResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredAudiences = [...DUMMY_AUDIENCES];

  // Apply filters
  if (params?.nameSearch) {
    const search = params.nameSearch.toLowerCase();
    filteredAudiences = filteredAudiences.filter((a) =>
      a.name.toLowerCase().includes(search),
    );
  }

  if (params?.createdBy) {
    filteredAudiences = filteredAudiences.filter(
      (a) => a.createdBy === params.createdBy,
    );
  }

  if (params?.verified !== undefined) {
    filteredAudiences = filteredAudiences.filter(
      (a) => a.verified === params.verified,
    );
  }

  if (params?.status) {
    const statuses = params.status.split(",");
    filteredAudiences = filteredAudiences.filter((a) =>
      statuses.includes(a.status),
    );
  }

  if (params?.tag) {
    const tags = params.tag.split(",");
    filteredAudiences = filteredAudiences.filter((a) =>
      a.tags.some((tag) => tags.includes(tag)),
    );
  }

  // Pagination
  const page = params?.page ?? 0;
  const pageSize = params?.pageSize ?? 10;
  const totalCount = filteredAudiences.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAudiences = filteredAudiences.slice(startIndex, endIndex);

  return {
    audiences: paginatedAudiences,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    },
  };
};

export const useAudiences = (params?: AudienceFilters) => {
  return useQuery<AudiencesResponse, Error>({
    queryKey: audienceKeys.list(params),
    queryFn: () => fetchAudiences(params),
    retry: 3,
    retryDelay: 1000,
  });
};

export type { AudiencesResponse, AudienceFilters, Audience } from "./types";
