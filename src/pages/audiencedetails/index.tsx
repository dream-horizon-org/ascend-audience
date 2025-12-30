import { useParams, useNavigate } from "react-router";
import { useState, useRef, useMemo } from "react";
import { Box, Typography, CircularProgress, Chip, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PageHeader from "../../components/PageHeader/PageHeader";

// Enable dayjs custom parse format
dayjs.extend(customParseFormat);
import AscendModal from "../../components/AscendModal/AscendModal";
import AscendTextField from "../../components/AscendTextField/AscendTextField";
import AscendSelect from "../../components/AscendSelect/AscendSelect";
import { useAudienceDetails, useDatasources } from "../../network/queries";
import { useImportCohort, useAddRule } from "../../network/mutations";
import { useSnackbar } from "../../contexts/SnackbarContext";
import type { AudienceRule } from "../../network/queries/getAudienceDetails/types";

const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 0.5, fontSize: "0.8125rem", fontWeight: 500 }}
    >
      {label}
    </Typography>
    <Box sx={{ fontSize: "0.875rem" }}>
      {value}
    </Box>
  </Box>
);

export default function AudienceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { showSuccess, showError } = useSnackbar();

  const { data, isLoading, isError, error } = useAudienceDetails(id || "");
  const importMutation = useImportCohort();
  const addRuleMutation = useAddRule();
  const { data: datasourcesData } = useDatasources(100);

  // CSV Upload states
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rule modal states
  const [selectedRule, setSelectedRule] = useState<AudienceRule | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  // Add rule modal states
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [ruleStartTime, setRuleStartTime] = useState("");
  const [ruleEndTime, setRuleEndTime] = useState("");
  const [ruleSourceId, setRuleSourceId] = useState<number | null>(null);
  const [ruleQuery, setRuleQuery] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  const handleRuleClick = (rule: AudienceRule) => {
    setSelectedRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleRuleModalClose = () => {
    setIsRuleModalOpen(false);
    setSelectedRule(null);
  };

  const handleAddRuleClick = () => {
    setIsAddRuleModalOpen(true);
  };

  const handleAddRuleModalClose = () => {
    setIsAddRuleModalOpen(false);
    // Reset form fields
    setRuleName("");
    setRuleDescription("");
    setRuleStartTime("");
    setRuleEndTime("");
    setRuleSourceId(null);
    setRuleQuery("");
  };

  const handleAddRuleSubmit = async () => {
    if (!id || !ruleName || !ruleDescription || !ruleStartTime || !ruleEndTime || !ruleSourceId || !ruleQuery) {
      showError("Please fill in all required fields");
      return;
    }

    // Parse date strings to Unix timestamps in milliseconds
    const startTimeMs = dayjs(ruleStartTime, "YYYY-MM-DD", true).valueOf();
    const endTimeMs = dayjs(ruleEndTime, "YYYY-MM-DD", true).valueOf();

    addRuleMutation.mutate(
      {
        audienceId: id,
        data: {
          rules: [
            {
              name: ruleName,
              description: ruleDescription,
              start_time: startTimeMs,
              end_time: endTimeMs,
              rule_type: "BATCH",
              rule_action: "ADD",
              configuration: {
                configuration_type: "BATCH",
                source: {
                  id: ruleSourceId,
                },
                query: ruleQuery,
              },
            },
          ],
        },
      },
      {
        onSuccess: () => {
          showSuccess("Rule added successfully");
          handleAddRuleModalClose();
        },
        onError: (err) => {
          showError(err.message || "Failed to add rule");
        },
      }
    );
  };

  // Prepare datasources options for select
  const datasourceOptions = useMemo(() => {
    if (!datasourcesData?.pages) return [];
    return datasourcesData.pages.flatMap((page) =>
      page.datasources.map((ds) => ({
        value: ds.id,
        label: `${ds.name} (${ds.type})`,
      }))
    );
  }, [datasourcesData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        showError("Please upload a CSV file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      showError("Please upload a CSV file");
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file || !id) return;

    importMutation.mutate(
      {
        audienceId: id,
        data: {
          file,
          fileName: file.name,
        },
      },
      {
        onSuccess: () => {
          showSuccess("CSV uploaded successfully");
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (err) => {
          showError(err.message || "Failed to upload file");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <PageHeader title="Audience Details" onBack={handleBack} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading audience details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <PageHeader title="Audience Details" onBack={handleBack} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Failed to load audience details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error?.message || "An error occurred"}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Safely destructure data only after confirming it exists
  const { audienceMeta, sinks, rules } = data;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header - Fixed at top */}
      <PageHeader title={audienceMeta?.name || "Audience Details"} onBack={handleBack} />

      {/* Content - Scrollable middle section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            border: "1px solid #DADADD",
            borderRadius: "8px",
            p: 2.5,
            m: "1rem",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Title Section */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: "1rem" }}>
            Audience Information
          </Typography>

          {/* Grid Layout for Fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 2,
            }}
          >
            <InfoField label="Audience Name" value={audienceMeta.name} />
            <InfoField 
              label="Type" 
              value={audienceMeta.type.charAt(0).toUpperCase() + audienceMeta.type.slice(1).toLowerCase()} 
            />
            <InfoField
              label="Valid Till"
              value={dayjs(audienceMeta.expireDate * 1000).format("DD MMM YYYY")}
            />
            <InfoField label="Verified" value={audienceMeta.verified ? "Yes" : "No"} />
            <InfoField
              label="Created At"
              value={dayjs(audienceMeta.createdAt * 1000).format("DD MMM YYYY")}
            />
            <InfoField
              label="Updated At"
              value={dayjs(audienceMeta.updatedAt * 1000).format("DD MMM YYYY")}
            />
          </Box>

          {/* Description - Full Width */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: "0.8125rem", fontWeight: 500 }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "0.875rem",
                lineHeight: 1.5,
                color: "#374151",
              }}
            >
              {audienceMeta.description}
            </Typography>
          </Box>

          {/* Destinations */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontSize: "0.8125rem", fontWeight: 500 }}
            >
              Destinations
            </Typography>
            {sinks.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 1.5,
                }}
              >
                {sinks.map((sink) => (
                  <Box
                    key={sink.id}
                    sx={{
                      p: 1.5,
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      backgroundColor: "#FAFBFC",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "#F3F4F6",
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#111827",
                          flex: 1,
                          mr: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sink.name}
                      </Typography>
                      <Chip
                        label={sink.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            sink.status === "ACTIVE" ? "#DEF7EC" : "#FEE2E2",
                          color: sink.status === "ACTIVE" ? "#03543F" : "#991B1B",
                          fontWeight: 500,
                          fontSize: "0.625rem",
                          height: "18px",
                          border: "none",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                      }}
                    >
                      {sink.type}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No destinations configured
              </Typography>
            )}
          </Box>
        </Box>

        {/* Rules Section - Compact List */}
        <Box
          sx={{
            border: "1px solid #DADADD",
            borderRadius: "8px",
            p: 2.5,
            m: "1rem",
            mt: 0,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
              Rules
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRuleClick}
              sx={{ textTransform: "none" }}
            >
              Add Rule
            </Button>
          </Box>
          {rules && rules.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {rules.map((rule) => (
                <Box
                  key={rule.ruleId}
                  onClick={() => handleRuleClick(rule)}
                  sx={{
                    p: 1.5,
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: "#FAFBFC",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                      borderColor: "#D1D5DB",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#111827",
                        flex: 1,
                        mr: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rule.name}
                    </Typography>
                    <Chip
                      label={rule.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          rule.status === "ACTIVE" || rule.status === "SCHEDULED"
                            ? "#DEF7EC"
                            : rule.status === "PAUSED"
                            ? "#FEF3C7"
                            : "#FEE2E2",
                        color:
                          rule.status === "ACTIVE" || rule.status === "SCHEDULED"
                            ? "#03543F"
                            : rule.status === "PAUSED"
                            ? "#92400E"
                            : "#991B1B",
                        fontWeight: 500,
                        fontSize: "0.625rem",
                        height: "18px",
                        border: "none",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                    }}
                  >
                    {rule.ruleType}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No rules configured
            </Typography>
          )}
        </Box>

        {/* Add Rule Modal */}
        <AscendModal
          open={isAddRuleModalOpen}
          onClose={handleAddRuleModalClose}
          config={{
            title: "Add New Rule",
            width: 900,
            maxWidth: "90vw",
            showCloseButton: false,
            content: (
              <Box sx={{ position: "relative" }}>
                {/* Close Icon Button */}
                <IconButton
                  onClick={handleAddRuleModalClose}
                  sx={{
                    position: "absolute",
                    right: -24,
                    top: -48,
                    color: "#6B7280",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                      color: "#111827",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Name */}
                  <AscendTextField
                    label="Name"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    required
                    fullWidth
                    size="small"
                  />

                  {/* Description */}
                  <AscendTextField
                    label="Description"
                    value={ruleDescription}
                    onChange={(e) => setRuleDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                  />

                  {/* Start Time and End Time - Side by Side */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <AscendTextField
                      label="Start Time"
                      type="date"
                      value={ruleStartTime}
                      onChange={(e) => setRuleStartTime(e.target.value)}
                      required
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <AscendTextField
                      label="End Time"
                      type="date"
                      value={ruleEndTime}
                      onChange={(e) => setRuleEndTime(e.target.value)}
                      required
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>

                  {/* Source */}
                  <AscendSelect
                    label="Source"
                    value={ruleSourceId || ""}
                    onChange={(e) => setRuleSourceId(Number(e.target.value))}
                    options={datasourceOptions}
                    required
                    fullWidth
                  />

                  {/* Query */}
                  <AscendTextField
                    label="Query"
                    value={ruleQuery}
                    onChange={(e) => setRuleQuery(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    placeholder="Enter your query here..."
                  />

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 0.5 }}>
                    <Button
                      variant="outlined"
                      onClick={handleAddRuleModalClose}
                      size="small"
                      sx={{ textTransform: "none", minWidth: "70px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddRuleSubmit}
                      disabled={addRuleMutation.isPending}
                      size="small"
                      sx={{ textTransform: "none", minWidth: "90px" }}
                    >
                      {addRuleMutation.isPending ? "Adding..." : "Add Rule"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ),
          }}
        />

        {/* Rule Details Modal */}
        <AscendModal
          open={isRuleModalOpen}
          onClose={handleRuleModalClose}
          config={{
            title: "Rule Details",
            width: 600,
            maxWidth: "90vw",
            showCloseButton: false,
            content: selectedRule && (
              <Box sx={{ position: "relative" }}>
                {/* Close Icon Button */}
                <IconButton
                  onClick={handleRuleModalClose}
                  sx={{
                    position: "absolute",
                    right: -24,
                    top: -48,
                    color: "#6B7280",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                      color: "#111827",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Name */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#6B7280",
                      fontWeight: 500,
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#374151",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedRule.name}
                  </Typography>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#6B7280",
                      fontWeight: 500,
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#374151",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedRule.description}
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#6B7280",
                      fontWeight: 500,
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#374151",
                    }}
                  >
                    {selectedRule.status}
                  </Typography>
                </Box>

                {/* Time Range */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2.5,
                    mb: 2.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        fontWeight: 500,
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      Start time
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}
                    >
                      {dayjs(selectedRule.startTime).format("DD MMM YYYY, hh:mm A")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        fontWeight: 500,
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      End time
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}
                    >
                      {dayjs(selectedRule.endTime).format("DD MMM YYYY, hh:mm A")}
                    </Typography>
                  </Box>
                </Box>

                {/* Source Name */}
                {selectedRule.configuration?.source?.details && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        fontWeight: 500,
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      Source
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}
                    >
                      {selectedRule.configuration.source.details.name}
                    </Typography>
                  </Box>
                )}

                {/* Query Box */}
                {selectedRule.configuration?.query && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        fontWeight: 500,
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      Query
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "6px",
                        fontFamily: "monospace",
                        fontSize: "0.8125rem",
                        color: "#1F2937",
                        lineHeight: 1.6,
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {selectedRule.configuration.query}
                    </Box>
                  </Box>
                )}
              </Box>
            ),
          }}
        />

        {/* CSV Upload Section - Only for STATIC type */}
        {audienceMeta.type === "STATIC" && (
          <Box
            sx={{
              border: "1px solid #DADADD",
              borderRadius: "8px",
              p: 2.5,
              m: "1rem",
              mt: 0,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: "1rem" }}>
              Upload CSV
            </Typography>
            
            {/* File Input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileSelect}
            />

            {/* Drop Zone */}
            <Box
              onClick={handleDropZoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                width: "100%",
                minHeight: 180,
                border: `2px dashed ${isDragOver ? theme.palette.primary.main : "#E5E7EB"}`,
                borderRadius: "6px",
                backgroundColor: isDragOver
                  ? theme.palette.primary.light + "20"
                  : "#FAFBFC",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + "10",
                },
              }}
            >
              {!file ? (
                <>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 48,
                      color: isDragOver
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      mb: 1.5,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.primary, mb: 0.5, fontSize: "0.9375rem" }}
                  >
                    Drag & drop your CSV file here
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, mb: 1.5, fontSize: "0.8125rem" }}
                  >
                    or click to browse
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
                    Browse Files
                  </Button>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <InsertDriveFileIcon
                    sx={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.875rem",
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}
                  >
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>

            {/* Upload Button */}
            {file && (
              <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  disabled={!file || importMutation.isPending}
                  onClick={handleUpload}
                  sx={{ textTransform: "none" }}
                >
                  {importMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

