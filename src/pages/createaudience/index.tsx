import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PageHeader from "../../components/PageHeader/PageHeader";
import AscendTextFieldControlled from "../../components/AscendTextField/AscendTextFieldControlled";
import AscendAutoCompletePaginated from "../../components/AscendAutoComplete/AscendAutoCompletePaginated";
import AscendSelectControlled from "../../components/AscendSelect/AscendSelectControlled";
import AscendButton from "../../components/AscendButton/AscendButton";
import { useDatasinks, type Datasink } from "../../network/queries";
import { useCreateAudience, type CreateAudienceRequest } from "../../network/mutations";
import { useSnackbar } from "../../contexts/SnackbarContext";

// Enable dayjs custom parse format
dayjs.extend(customParseFormat);

// Zod validation schema - only validate required fields (cannot be null or empty)
const audienceSchema = z.object({
  name: z
    .string()
    .nonempty("Audience name is required"),
  description: z
    .string()
    .nonempty("Description is required"),
  type: z
    .enum(["CONDITIONAL", "STATIC"], {
      message: "Please select an audience type",
    }),
  sink_ids: z
    .array(z.string())
    .min(1, "Please select at least one destination"),
  expire_date: z
    .string()
    .nonempty("Valid till date is required")
    .refine(
      (date) => {
        const parsed = dayjs(date, "YYYY-MM-DD", true);
        return parsed.isValid();
      },
      {
        message: "Please select a valid date",
      }
    )
    .refine(
      (date) => {
        const parsed = dayjs(date, "YYYY-MM-DD", true);
        return parsed.isAfter(dayjs(), "day") || parsed.isSame(dayjs(), "day");
      },
      {
        message: "Date must be today or in the future",
      }
    ),
});

type AudienceFormData = z.infer<typeof audienceSchema>;

export default function CreateAudience() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const { control, handleSubmit, formState: { isValid } } = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "CONDITIONAL",
      sink_ids: [],
      expire_date: "",
    },
    mode: "onChange", // Validate on change to enable/disable button in real-time
  });

  // Create audience mutation
  const createAudienceMutation = useCreateAudience();

  // Fetch datasinks with pagination (no search support)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useDatasinks(10);

  // Flatten all pages of datasinks into a single array
  const allDatasinks = useMemo(() => {
    return data?.pages.flatMap((page) => page.datasinks) || [];
  }, [data]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onSubmit = async (data: AudienceFormData) => {
    // Parse date string to Unix timestamp (YYYY-MM-DD format from date input)
    const parsedDate = dayjs(data.expire_date, "YYYY-MM-DD", true);
    
    // Transform form data to API payload format
    const payload: CreateAudienceRequest = {
      name: data.name,
      description: data.description,
      sink_ids: data.sink_ids.map((id) => parseInt(id, 10)), // Convert string IDs to numbers
      expire_date: Math.floor(parsedDate.valueOf() / 1000), // Convert to Unix timestamp (seconds)
      type: data.type, // Use selected type
    };

    try {
      const result = await createAudienceMutation.mutateAsync(payload);
      console.log("Audience created successfully:", result);

      // Show success message
      showSuccess("Audience created successfully");

      // Navigate to the newly created audience details page (replace history so back doesn't return to create form)
      const newAudienceId = result.data;
      setTimeout(() => {
        navigate(`/audience/${newAudienceId}`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Failed to create audience:", error);
      
      // Show error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create audience. Please try again.";
      
      showError(errorMessage);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header - Fixed at top */}
      <PageHeader title="New Audience" onBack={handleBack} />

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
            p: 3,
            m: "1rem",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Audience Name and Valid Till in one row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <AscendTextFieldControlled
                  name="name"
                  control={control}
                  label="Audience Name"
                  placeholder="Enter audience name"
                  infoText="A unique identifier for your audience"
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AscendTextFieldControlled
                  name="expire_date"
                  control={control}
                  label="Valid Till"
                  type="date"
                  infoText="Select the date until which this audience will be valid"
                  required
                  InputProps={{
                    inputProps: { 
                      min: dayjs().format("YYYY-MM-DD") 
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Type and Description Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <AscendSelectControlled
                  name="type"
                  control={control}
                  label="Type"
                  options={[
                    { label: "Conditional", value: "CONDITIONAL" },
                    { label: "Static", value: "STATIC" },
                  ]}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AscendTextFieldControlled
                  name="description"
                  control={control}
                  label="Description"
                  placeholder="Enter audience description"
                  required
                />
              </Box>
            </Box>
            <AscendAutoCompletePaginated<AudienceFormData, Datasink>
              name="sink_ids"
              control={control}
              label="Destination"
              placeholder="Select destinations"
              options={allDatasinks}
              loading={isLoading || isFetchingNextPage}
              hasMore={hasNextPage || false}
              onLoadMore={handleLoadMore}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id.toString()}
              enableSearch={false}
              multiple
              filterSelectedOptions={true}
              freeSolo={false}
              required
              chipStyles={{
                backgroundColor: "#E1E3EA",
                border: "none",
                borderRadius: 0,
                height: "24px",
                fontSize: "0.75rem",
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
                "& .MuiChip-deleteIcon": {
                  color: "#666666",
                  fontSize: "0.875rem",
                  margin: "0 4px 0 -4px",
                  "&:hover": {
                    color: "#333333",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer - Fixed at bottom */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: "1rem",
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFFFFF",
        }}
      >
        <AscendButton
          type="submit"
          variant="contained"
          size="large"
          sx={{ textTransform: "none" }}
          disabled={!isValid || createAudienceMutation.isPending || isLoading}
        >
          {createAudienceMutation.isPending ? "Creating..." : "Create"}
        </AscendButton>
      </Box>
    </Box>
  );
}
