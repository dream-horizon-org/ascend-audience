import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import AscendButton from "../../components/AscendButton/AscendButton";
import PageHeader from "../../components/PageHeader/PageHeader";
import DynamicFormField from "../../components/DynamicForm/DynamicFormField";
import { 
  useDatasinks, 
  useDatasources, 
  useConnectorTypes,
  type Datasink, 
  type Datasource,
  type ConnectorType 
} from "../../network/queries";
import { 
  useOnboardDatasink, 
  useOnboardDatasource 
} from "../../network/mutations";
import { useSnackbar } from "../../contexts/SnackbarContext";

interface ColumnData {
  dataKey: string;
  label: string;
  width: string;
}

const COLUMNS: ColumnData[] = [
  { width: "10%", label: "ID", dataKey: "id" },
  { width: "40%", label: "Name", dataKey: "name" },
  { width: "25%", label: "Type", dataKey: "type" },
  { width: "25%", label: "Status", dataKey: "status" },
];

const DEFAULT_PAGE_SIZE = 20;

const createTableComponents = <T,>(theme: Theme): TableComponents<T> => ({
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
  TableRow: (props) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
});

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

const createRowContent = <T extends { id: number; name: string; type?: string; status?: string }>() =>
  (_index: number, row: T) => (
    <React.Fragment>
      {COLUMNS.map((column) => (
        <TableCell key={column.dataKey} sx={{ width: column.width }}>
          {String(row[column.dataKey as keyof T] ?? "")}
        </TableCell>
      ))}
    </React.Fragment>
  );

const Connector = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Modal states
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  
  // Selected connector types
  const [selectedDestinationType, setSelectedDestinationType] = useState<ConnectorType | null>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<ConnectorType | null>(null);

  // Fetch connector types
  const { data: sinkTypes = [], isLoading: isLoadingSinkTypes } = useConnectorTypes("SINK");
  const { data: sourceTypes = [], isLoading: isLoadingSourceTypes } = useConnectorTypes("SOURCE");

  // Mutations
  const onboardDatasinkMutation = useOnboardDatasink();
  const onboardDatasourceMutation = useOnboardDatasource();

  // Form for destination
  const { control: destinationControl, handleSubmit: handleDestinationSubmit, reset: resetDestinationForm } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Form for source
  const { control: sourceControl, handleSubmit: handleSourceSubmit, reset: resetSourceForm } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Fetch datasinks (destinations)
  const {
    data: datasinksData,
    fetchNextPage: fetchNextSinks,
    hasNextPage: hasMoreSinks,
    isFetchingNextPage: isFetchingNextSinks,
    isLoading: isLoadingSinks,
  } = useDatasinks(DEFAULT_PAGE_SIZE);

  // Fetch datasources (sources)
  const {
    data: datasourcesData,
    fetchNextPage: fetchNextSources,
    hasNextPage: hasMoreSources,
    isFetchingNextPage: isFetchingNextSources,
    isLoading: isLoadingSources,
  } = useDatasources(DEFAULT_PAGE_SIZE);

  // Flatten datasinks
  const allDatasinks = useMemo(() => {
    return datasinksData?.pages.flatMap((page) => page.datasinks) || [];
  }, [datasinksData]);

  // Flatten datasources
  const allDatasources = useMemo(() => {
    return datasourcesData?.pages.flatMap((page) => page.datasources) || [];
  }, [datasourcesData]);

  // IntersectionObserver refs
  const sinksObserverRef = useRef<HTMLDivElement>(null);
  const sourcesObserverRef = useRef<HTMLDivElement>(null);

  // Load more sinks
  const loadMoreSinks = useCallback(() => {
    if (isFetchingNextSinks || !hasMoreSinks) return;
    fetchNextSinks();
  }, [isFetchingNextSinks, hasMoreSinks, fetchNextSinks]);

  // Load more sources
  const loadMoreSources = useCallback(() => {
    if (isFetchingNextSources || !hasMoreSources) return;
    fetchNextSources();
  }, [isFetchingNextSources, hasMoreSources, fetchNextSources]);

  // IntersectionObserver for sinks
  useEffect(() => {
    const currentRef = sinksObserverRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextSinks && hasMoreSinks) {
          loadMoreSinks();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [loadMoreSinks, isFetchingNextSinks, hasMoreSinks]);

  // IntersectionObserver for sources
  useEffect(() => {
    const currentRef = sourcesObserverRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextSources && hasMoreSources) {
          loadMoreSources();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [loadMoreSources, isFetchingNextSources, hasMoreSources]);

  const tableComponents = useMemo(() => createTableComponents(theme), [theme]);

  const handleBack = () => {
    navigate("/");
  };

  const handleAddConnector = () => {
    // TODO: Navigate to add connector page
    console.log("Add connector clicked");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <PageHeader title="Connectors" onBack={handleBack}>
        <AscendButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddConnector}
          sx={{ textTransform: "none" }}
        >
          Add Connector
        </AscendButton>
      </PageHeader>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Destinations Table */}
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Destinations
            </Typography>
            <AscendButton
              variant="contained"
              size="small"
              onClick={() => setDestinationModalOpen(true)}
              sx={{ textTransform: "none" }}
            >
              New
            </AscendButton>
          </Box>
          {isLoadingSinks && allDatasinks.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : allDatasinks.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Typography variant="body1" color="text.secondary">
                No destinations found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              <TableVirtuoso
                style={{ height: "100%" }}
                data={allDatasinks}
                components={tableComponents}
                fixedHeaderContent={TableHeader}
                itemContent={createRowContent<Datasink>()}
                overscan={200}
              />
              <Box ref={sinksObserverRef} sx={{ height: 20, width: "100%" }} />
            </Box>
          )}
        </Box>

        {/* Sources Table */}
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sources
            </Typography>
            <AscendButton
              variant="contained"
              size="small"
              onClick={() => setSourceModalOpen(true)}
              sx={{ textTransform: "none" }}
            >
              New
            </AscendButton>
          </Box>
          {isLoadingSources && allDatasources.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : allDatasources.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Typography variant="body1" color="text.secondary">
                No sources found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              <TableVirtuoso
                style={{ height: "100%" }}
                data={allDatasources}
                components={tableComponents}
                fixedHeaderContent={TableHeader}
                itemContent={createRowContent<Datasource>()}
                overscan={200}
              />
              <Box ref={sourcesObserverRef} sx={{ height: 20, width: "100%" }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Destination Onboard Modal */}
      <Dialog
        open={destinationModalOpen}
        onClose={() => setDestinationModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Onboard Destination</Typography>
            <IconButton
              onClick={() => {
                setDestinationModalOpen(false);
                setSelectedDestinationType(null);
                resetDestinationForm({ name: "" });
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            {/* Connector Type Dropdown */}
            <TextField
              select
              label="Connector Type"
              value={selectedDestinationType?.id || ""}
              onChange={(e) => {
                const type = sinkTypes.find((t) => t.id === Number(e.target.value));
                setSelectedDestinationType(type || null);
                resetDestinationForm({ name: "" });
              }}
              fullWidth
              size="small"
              disabled={isLoadingSinkTypes}
            >
              {sinkTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.displayName}
                </MenuItem>
              ))}
            </TextField>

            {/* Name Field */}
            {selectedDestinationType && (
              <DynamicFormField
                name="name"
                control={destinationControl}
                property={{ type: "string" }}
                label="Name"
                required={true}
              />
            )}

            {/* Dynamic Form Fields */}
            {selectedDestinationType && (
              <>
                {Object.entries(selectedDestinationType.configSchema.properties).map(([key, property]) => {
                  const isRequired = selectedDestinationType.configSchema.required.includes(key);
                  return (
                    <DynamicFormField
                      key={key}
                      name={key as any}
                      control={destinationControl}
                      property={property}
                      label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      required={isRequired}
                    />
                  );
                })}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AscendButton
            variant="outlined"
            onClick={() => {
              setDestinationModalOpen(false);
              setSelectedDestinationType(null);
              resetDestinationForm();
            }}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </AscendButton>
          <AscendButton
            variant="contained"
            onClick={handleDestinationSubmit((data) => {
              if (!selectedDestinationType) return;
              
              const { name, ...config } = data;
              
              onboardDatasinkMutation.mutate(
                {
                  name: name as string,
                  type_id: selectedDestinationType.id,
                  config,
                },
                {
                  onSuccess: () => {
                    showSnackbar("Destination onboarded successfully", "success");
                    setDestinationModalOpen(false);
                    setSelectedDestinationType(null);
                    resetDestinationForm({ name: "" });
                  },
                  onError: (error: any) => {
                    showSnackbar(
                      error?.response?.data?.message || "Failed to onboard destination",
                      "error"
                    );
                  },
                }
              );
            })}
            sx={{ textTransform: "none" }}
            disabled={!selectedDestinationType || onboardDatasinkMutation.isPending}
          >
            {onboardDatasinkMutation.isPending ? "Submitting..." : "Submit"}
          </AscendButton>
        </DialogActions>
      </Dialog>

      {/* Source Onboard Modal */}
      <Dialog
        open={sourceModalOpen}
        onClose={() => setSourceModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Onboard Source</Typography>
            <IconButton
              onClick={() => {
                setSourceModalOpen(false);
                setSelectedSourceType(null);
                resetSourceForm({ name: "" });
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            {/* Connector Type Dropdown */}
            <TextField
              select
              label="Connector Type"
              value={selectedSourceType?.id || ""}
              onChange={(e) => {
                const type = sourceTypes.find((t) => t.id === Number(e.target.value));
                setSelectedSourceType(type || null);
                resetSourceForm({ name: "" });
              }}
              fullWidth
              size="small"
              disabled={isLoadingSourceTypes}
            >
              {sourceTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.displayName}
                </MenuItem>
              ))}
            </TextField>

            {/* Name Field */}
            {selectedSourceType && (
              <DynamicFormField
                name="name"
                control={sourceControl}
                property={{ type: "string" }}
                label="Name"
                required={true}
              />
            )}

            {/* Dynamic Form Fields */}
            {selectedSourceType && (
              <>
                {Object.entries(selectedSourceType.configSchema.properties).map(([key, property]) => {
                  const isRequired = selectedSourceType.configSchema.required.includes(key);
                  return (
                    <DynamicFormField
                      key={key}
                      name={key as any}
                      control={sourceControl}
                      property={property}
                      label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      required={isRequired}
                    />
                  );
                })}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AscendButton
            variant="outlined"
            onClick={() => {
              setSourceModalOpen(false);
              setSelectedSourceType(null);
              resetSourceForm();
            }}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </AscendButton>
          <AscendButton
            variant="contained"
            onClick={handleSourceSubmit((data) => {
              if (!selectedSourceType) return;
              
              const { name, ...config } = data;
              
              onboardDatasourceMutation.mutate(
                {
                  name: name as string,
                  type_id: selectedSourceType.id,
                  config,
                },
                {
                  onSuccess: () => {
                    showSnackbar("Source onboarded successfully", "success");
                    setSourceModalOpen(false);
                    setSelectedSourceType(null);
                    resetSourceForm({ name: "" });
                  },
                  onError: (error: any) => {
                    showSnackbar(
                      error?.response?.data?.message || "Failed to onboard source",
                      "error"
                    );
                  },
                }
              );
            })}
            sx={{ textTransform: "none" }}
            disabled={!selectedSourceType || onboardDatasourceMutation.isPending}
          >
            {onboardDatasourceMutation.isPending ? "Submitting..." : "Submit"}
          </AscendButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Connector;

