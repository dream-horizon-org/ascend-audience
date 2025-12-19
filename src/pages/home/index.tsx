import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import AscendSearchbar from "../../components/AscendSearchbar/AscendSearchbar";
import AscendButton from "../../components/AscendButton/AscendButton";
import AscendDropdown from "../../components/AscendDropdown/AscendDropdown";
import {
  useTags,
  useAudiences,
  Audience,
  AudienceFilters,
} from "../../network";
import { useDebounce } from "../../utils/useDebounce";

interface ColumnData {
  dataKey: keyof Audience | "actions";
  label: string;
  width: string;
}

const COLUMNS: ColumnData[] = [
  { width: "15%", label: "Audience ID", dataKey: "audienceId" },
  { width: "35%", label: "Name", dataKey: "name" },
  { width: "10%", label: "Status", dataKey: "status" },
  { width: "25%", label: "Tags", dataKey: "tags" },
  { width: "10%", label: "Last Modified", dataKey: "updatedAt" },
  { width: "5%", label: "", dataKey: "actions" },
];

const STATUS_OPTIONS = ["LIVE", "PAUSED", "CONCLUDED", "TERMINATED"];

const DEFAULT_PAGE_SIZE = 20;

const createTableComponents = (
  theme: Theme,
  onRowClick: (audience: Audience) => void,
): TableComponents<Audience> => ({
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer
      component={Paper}
      {...props}
      ref={ref}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${theme.palette.border.main}`,
      }}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: "separate",
        tableLayout: "fixed",
        "& .MuiTableCell-root": {
          height: theme.customComponents.table.rowHeight,
          padding: theme.customComponents.table.cellPadding,
          borderBottom: `1px solid ${theme.customComponents.table.borderColor}`,
          fontSize: theme.customComponents.table.fontSize,
        },
      }}
    />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item, ...props }) => (
    <TableRow
      {...props}
      onClick={() => onRowClick(item)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    />
  ),
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
});

const RowActionsMenu: React.FC<{ row: Audience }> = () => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add action menu functionality
  };

  return (
    <IconButton size="small" onClick={handleMenuClick}>
      <MoreHorizIcon />
    </IconButton>
  );
};

const CellWithTooltip: React.FC<{ text: string; width: string }> = ({
  text,
  width,
}) => {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  return (
    <TableCell sx={{ width }}>
      <Tooltip
        title={text}
        placement="top"
        arrow
        disableHoverListener={!isOverflowing}
      >
        <Typography
          ref={textRef}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: isOverflowing ? "pointer" : "default",
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

const StatusChip: React.FC<{ status: string; theme: Theme }> = ({
  status,
  theme,
}) => {
  const statusKey =
    status.toLowerCase() as keyof typeof theme.customComponents.status;
  const config =
    theme.customComponents.status[statusKey] ||
    theme.customComponents.status.draft;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: "28px",
        borderRadius: "4px",
        backgroundColor: config.background,
        color: config.color,
        fontWeight: 500,
        fontSize: "12px",
        "& .MuiChip-label": { padding: "0 12px", lineHeight: 1 },
      }}
    />
  );
};

const TagsCell: React.FC<{ tags: string[]; theme: Theme }> = ({
  tags,
  theme,
}) => {
  const visibleTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        overflow: "hidden",
        maxWidth: "100%",
        flexWrap: "nowrap",
      }}
    >
      {visibleTags.map((tag, idx) => (
        <Chip
          key={idx}
          label={tag}
          size="small"
          sx={{
            height: "28px",
            borderRadius: theme.customComponents.chip.borderRadius,
            backgroundColor: theme.customComponents.chip.background,
            color: theme.customComponents.chip.text,
            fontSize: "14px",
            fontWeight: 400,
            flexShrink: 0,
            maxWidth: "100%",
            "& .MuiChip-label": {
              padding: "4px 8px",
              lineHeight: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      ))}
      {remainingCount > 0 && (
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: theme.palette.primary.main,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          +{remainingCount}
        </Typography>
      )}
    </Box>
  );
};

const TableHeader = () => (
  <TableRow>
    {COLUMNS.map((column) => (
      <TableCell
        key={column.dataKey}
        variant="head"
        sx={{
          width: column.width,
          backgroundColor: "background.default",
          fontWeight: 600,
        }}
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const createRowContent = (theme: Theme) => (_index: number, row: Audience) => (
  <React.Fragment>
    {COLUMNS.map((column) => {
      if (column.dataKey === "audienceId")
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.audienceId}
            width={column.width}
          />
        );

      if (column.dataKey === "name")
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.name}
            width={column.width}
          />
        );

      if (column.dataKey === "status") {
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            <StatusChip status={row.status} theme={theme} />
          </TableCell>
        );
      }

      if (column.dataKey === "tags") {
        return (
          <TableCell
            key={column.dataKey}
            sx={{ width: column.width, overflow: "hidden" }}
          >
            <TagsCell tags={row.tags} theme={theme} />
          </TableCell>
        );
      }

      if (column.dataKey === "actions") {
        return (
          <TableCell
            key={column.dataKey}
            align="center"
            sx={{ width: column.width }}
            onClick={(e) => e.stopPropagation()}
          >
            <RowActionsMenu row={row} />
          </TableCell>
        );
      }

      if (column.dataKey === "updatedAt") {
        const formattedDate = new Date(row.updatedAt).toLocaleDateString(
          "en-US",
          {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          },
        );
        return (
          <TableCell key={column.dataKey} sx={{ width: column.width }}>
            {formattedDate}
          </TableCell>
        );
      }

      return (
        <TableCell key={column.dataKey} sx={{ width: column.width }}>
          {String(row[column.dataKey as keyof Audience] ?? "")}
        </TableCell>
      );
    })}
  </React.Fragment>
);

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Debounce filter values (300ms delay)
  const debouncedSearchText = useDebounce(searchText, 300);
  const debouncedStatusFilter = useDebounce(statusFilter, 300);
  const debouncedTagsFilter = useDebounce(tagsFilter, 300);

  // Accumulated audiences for infinite scroll
  const [allAudiences, setAllAudiences] = useState<Audience[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch tags from API
  const { data: tagsData, isLoading: isTagsLoading } = useTags();
  const tagOptions = tagsData ?? [];

  // Build filter params for API - uses debounced values
  const filterParams = useMemo<AudienceFilters>(() => {
    const params: AudienceFilters = {
      pageSize: DEFAULT_PAGE_SIZE,
      page: currentPage,
    };

    if (debouncedSearchText.trim()) {
      params.nameSearch = debouncedSearchText.trim();
    }

    // Comma-separated status values
    if (debouncedStatusFilter.length > 0) {
      params.status = debouncedStatusFilter.join(",");
    }

    // Comma-separated tag values
    if (debouncedTagsFilter.length > 0) {
      params.tag = debouncedTagsFilter.join(",");
    }

    return params;
  }, [
    debouncedSearchText,
    debouncedStatusFilter,
    debouncedTagsFilter,
    currentPage,
  ]);

  // Fetch audiences from API (uses queryClient retry configuration)
  const {
    data: audiencesData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAudiences(filterParams);

  // Track previous filter values to detect filter changes
  const prevFiltersRef = useRef({
    searchText: debouncedSearchText,
    statusFilter: debouncedStatusFilter,
    tagsFilter: debouncedTagsFilter,
  });

  // Reset and update state when data or page changes
  // Note: This effect intentionally calls setState to manage infinite scroll state
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev.searchText !== debouncedSearchText ||
      prev.statusFilter.join() !== debouncedStatusFilter.join() ||
      prev.tagsFilter.join() !== debouncedTagsFilter.join();

    if (filtersChanged) {
      // Filters changed - reset everything
      prevFiltersRef.current = {
        searchText: debouncedSearchText,
        statusFilter: debouncedStatusFilter,
        tagsFilter: debouncedTagsFilter,
      };
      setAllAudiences(audiencesData?.audiences ?? []);
      setCurrentPage(0);
      setHasMore(audiencesData?.pagination?.hasNext ?? false);
    } else if (audiencesData?.audiences) {
      // Same filters, new page data
      if (currentPage === 0) {
        setAllAudiences(audiencesData.audiences);
      } else {
        setAllAudiences((prev) => {
          const existingIds = new Set(prev.map((e) => e.audienceId));
          const newAudiences = audiencesData.audiences.filter(
            (e) => !existingIds.has(e.audienceId),
          );
          return [...prev, ...newAudiences];
        });
      }
      setHasMore(audiencesData.pagination?.hasNext ?? false);
    }
  }, [
    audiencesData,
    currentPage,
    debouncedSearchText,
    debouncedStatusFilter,
    debouncedTagsFilter,
  ]);

  const pagination = audiencesData?.pagination;

  const hasFilters =
    searchText.trim() !== "" ||
    statusFilter.length > 0 ||
    tagsFilter.length > 0;

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter([]);
    setTagsFilter([]);
    setCurrentPage(0);
    setAllAudiences([]);
    setHasMore(true);
  };

  const handleRefresh = () => {
    setAllAudiences([]);
    setCurrentPage(0);
    setHasMore(true);
    refetch();
  };

  const handleCreateAudience = () => {
    navigate("/create-audience");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleStatusChange = (value: string | string[]) => {
    setStatusFilter(value as string[]);
  };

  const handleTagsChange = (value: string | string[]) => {
    setTagsFilter(value as string[]);
  };

  const handleRowClick = useCallback(
    (audience: Audience) => {
      navigate(`/audience/${audience.audienceId}`, {
        state: {
          audienceId: audience.audienceId,
          projectKey: audience.projectKey,
          defaultTab: "details",
        },
      });
    },
    [navigate],
  );

  // IntersectionObserver ref for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

  // Load more audiences when scrolling to the end
  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    setCurrentPage((prev) => prev + 1);
  }, [isFetching, hasMore]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [loadMore, isFetching, hasMore]);

  // Memoize table components to prevent unnecessary re-renders
  const tableComponents = useMemo(
    () => createTableComponents(theme, handleRowClick),
    [theme, handleRowClick],
  );

  return (
    <Box
      sx={{
        padding: "24px",
        gap: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "35px",
          minHeight: "35px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Title and Search */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
            Audiences
          </Typography>
          <AscendSearchbar
            size="small"
            variant="standard"
            placeholder="Search audiences..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Right: Filters and Actions */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {hasFilters && (
            <AscendButton variant="text" size="small" onClick={clearFilters}>
              Clear All
            </AscendButton>
          )}
          <AscendDropdown
            variant="multi-checkbox"
            size="md"
            borderRadius="lg"
            label="Status"
            placeholder="Select status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={handleStatusChange}
            showCount
          />
          <AscendDropdown
            variant="multi-checkbox"
            size="md"
            borderRadius="lg"
            label="Tags"
            placeholder={isTagsLoading ? "Loading..." : "Select tags"}
            options={tagOptions}
            value={tagsFilter}
            onChange={handleTagsChange}
            showCount
            disabled={isTagsLoading}
          />
          <AscendButton
            startIcon={<AddIcon />}
            size="small"
            onClick={handleCreateAudience}
          >
            Audience
          </AscendButton>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError || (allAudiences.length === 0 && !isFetching) ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              {isError
                ? "No audiences present"
                : hasFilters
                  ? "No audiences match your filters"
                  : "No audiences present"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {hasFilters && (
                <AscendButton variant="text" onClick={clearFilters}>
                  Clear Filters
                </AscendButton>
              )}
              <AscendButton variant="outlined" onClick={handleRefresh}>
                Refresh
              </AscendButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>
              <TableVirtuoso
                style={{ height: "100%" }}
                data={allAudiences}
                components={tableComponents}
                fixedHeaderContent={TableHeader}
                itemContent={createRowContent(theme)}
                overscan={200}
              />
              {/* Sentinel element for IntersectionObserver */}
              <Box ref={observerRef} sx={{ height: 20, width: "100%" }} />
            </Box>

            {/* Loading indicator for infinite scroll */}
            {isFetching && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 1,
                  flexShrink: 0,
                }}
              >
                <CircularProgress size={20} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  Loading...
                </Typography>
              </Box>
            )}

            {/* No more data message */}
            {!hasMore && allAudiences.length > 0 && (
              <Box sx={{ py: 1, px: 1, flexShrink: 0, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No more audiences
                </Typography>
              </Box>
            )}

            {/* Show total count */}
            {pagination && (
              <Box sx={{ py: 1, px: 1, flexShrink: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {allAudiences.length} of {pagination.totalCount}{" "}
                  audiences
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
