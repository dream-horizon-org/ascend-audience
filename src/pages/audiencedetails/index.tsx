import { useParams, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Box, Typography, CircularProgress, Chip, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import dayjs from "dayjs";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useAudienceDetails } from "../../network/queries";
import { useImportCohort } from "../../network/mutations";
import { useSnackbar } from "../../contexts/SnackbarContext";

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

  // CSV Upload states
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    navigate("/");
  };

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
  const { audienceMeta, sinks } = data;

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

