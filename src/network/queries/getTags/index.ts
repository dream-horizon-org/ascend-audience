import { useQuery } from "@tanstack/react-query";

// Dummy tags data
const DUMMY_TAGS = [
  "marketing",
  "high-value",
  "onboarding",
  "new-users",
  "retention",
  "at-risk",
  "premium",
  "subscribers",
  "trial",
  "conversion",
  "engagement",
  "analytics",
];

export const fetchTags = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DUMMY_TAGS;
};

export const useTags = () => {
  return useQuery<string[], Error>({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

