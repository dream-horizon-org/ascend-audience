import React, {
  useState,
  useMemo,
  useCallback,
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
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import AscendSearchbar from "../../components/AscendSearchbar/AscendSearchbar";
import AscendButton from "../../components/AscendButton/AscendButton";
import {
  useAudiencesList,
  type AudienceListItem,
} from "../../network";
import { useDebounce } from "../../utils/useDebounce";
import dayjs from "dayjs";

interface ColumnData {
  dataKey: keyof AudienceListItem | "actions";
  label: string;
  width: string;
}

const COLUMNS: ColumnData[] = [
  { width: "40%", label: "Name", dataKey: "name" },
  { width: "40%", label: "Type", dataKey: "type" },
  { width: "20%", label: "Expires", dataKey: "expire_date" },
];


const DEFAULT_PAGE_SIZE = 20;

const createTableComponents = (
  theme: Theme,
  onRowClick: (audience: AudienceListItem) => void,
): TableComponents<AudienceListItem> => ({
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer
      component={Paper}
      {...props}
      ref={ref}
      sx={{
        borderRadius: "8px",
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
    <TableHead 
      {...props} 
      ref={ref} 
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: theme.palette.background.default,
      }}
    />
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
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const createRowContent = () => (_index: number, row: AudienceListItem) => (
  <React.Fragment>
    {COLUMNS.map((column) => {
      if (column.dataKey === "name")
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.name}
            width={column.width}
          />
        );

      if (column.dataKey === "type") {
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()}
            width={column.width}
          />
        );
      }

      if (column.dataKey === "expire_date") {
        const formattedDate = dayjs(row.expire_date * 1000).format("MMM DD, YYYY");
        return (
          <CellWithTooltip
            key={column.dataKey}
            text={formattedDate}
            width={column.width}
          />
        );
      }

      return null;
    })}
  </React.Fragment>
);

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");

  // Debounce search (300ms delay)
  const debouncedSearchText = useDebounce(searchText, 300);


  // Fetch audiences from NEW API
  const {
    data: newApiData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAudiencesList(
    DEFAULT_PAGE_SIZE,
    debouncedSearchText || undefined,
    undefined,
    undefined
  );

  // Flatten new API data - use audiences from API directly
  const allAudiences = useMemo(() => {
    if (!newApiData) return [];
    return newApiData.pages.flatMap((page) => page.audiences);
  }, [newApiData]);

  const hasFilters = searchText.trim() !== "";

  const clearFilters = () => {
    setSearchText("");
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateAudience = () => {
    navigate("/create-audience");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = useCallback(
    (audience: AudienceListItem) => {
      navigate(`/${audience.audience_id}`);
    },
    [navigate],
  );

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
          <AscendButton
            variant="contained"
            size="small"
            onClick={() => navigate("/connections")}
          >
            Connections
          </AscendButton>
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
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <TableVirtuoso
                style={{ height: "100%" }}
                data={allAudiences}
                components={tableComponents}
                fixedHeaderContent={TableHeader}
                itemContent={createRowContent()}
                overscan={200}
                endReached={() => {
                  if (!isFetchingNextPage && hasNextPage) {
                    fetchNextPage();
                  }
                }}
              />
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
