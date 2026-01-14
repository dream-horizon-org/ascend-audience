export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "N/A";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
};

export const calculateDays = (startTime?: number, endTime?: number): number => {
  if (!startTime) return 0;
  try {
    const start = startTime * 1000; // Convert seconds to milliseconds
    const end = endTime ? endTime * 1000 : Date.now();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const mapStatus = (
  status: string,
): { label: string; color: "active" | "inactive" | "draft" } => {
  const statusMap: Record<
    string,
    { label: string; color: "active" | "inactive" | "draft" }
  > = {
    LIVE: { label: "Active", color: "active" },
    DRAFT: { label: "Draft", color: "draft" },
    PAUSED: { label: "Paused", color: "inactive" },
    CONCLUDED: { label: "Concluded", color: "inactive" },
    TERMINATED: { label: "Terminated", color: "inactive" },
  };
  return statusMap[status] || { label: status, color: "draft" };
};