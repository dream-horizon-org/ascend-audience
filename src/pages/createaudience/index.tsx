import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import PageHeader from "../../components/PageHeader/PageHeader";
import AscendTextFieldControlled from "../../components/AscendTextField/AscendTextFieldControlled";
import AscendAutoCompletePaginated from "../../components/AscendAutoComplete/AscendAutoCompletePaginated";
import AscendDatePickerControlled from "../../components/AscendDatePicker/AscendDatePickerControlled";
import AscendButton from "../../components/AscendButton/AscendButton";
import { useDatasinks, type Datasink } from "../../network/queries";
import { useCreateAudience, type CreateAudienceRequest } from "../../network/mutations";
import { useSnackbar } from "../../contexts/SnackbarContext";

// Zod validation schema matching API structure
const audienceSchema = z.object({
  name: z
    .string()
    .min(3, "Audience name must be at least 3 characters")
    .nonempty("Audience name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nonempty("Description is required"),
  sink_ids: z
    .array(z.string())
    .min(1, "Please select at least one destination"),
  expire_date: z
    .custom<Dayjs>((val) => dayjs.isDayjs(val), {
      message: "Please select a valid date",
    })
    .refine((date) => date.isAfter(dayjs(), "day") || date.isSame(dayjs(), "day"), {
      message: "Date must be today or in the future",
    }),
});

type AudienceFormData = z.infer<typeof audienceSchema>;

export default function CreateAudience() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const { control, handleSubmit } = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      name: "",
      description: "",
      sink_ids: [],
      expire_date: undefined,
    },
    mode: "onBlur", // Validate on blur for better UX
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
    // Transform form data to API payload format
    const payload: CreateAudienceRequest = {
      name: data.name,
      description: data.description,
      sink_ids: data.sink_ids.map((id) => parseInt(id, 10)), // Convert string IDs to numbers
      expire_date: Math.floor(data.expire_date.valueOf() / 1000), // Convert Dayjs to Unix timestamp (seconds)
      type: "CONDITIONAL", // Static value
    };

    try {
      const result = await createAudienceMutation.mutateAsync(payload);
      console.log("Audience created successfully:", result);
      
      // Show success message
      showSuccess("Audience created successfully");

      // Navigate back to audiences list after a short delay
      setTimeout(() => {
        navigate("/");
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
                <AscendDatePickerControlled
                  name="expire_date"
                  control={control}
                  label="Valid Till"
                  infoText="Select the date until which this audience will be valid"
                  required
                  minDate={dayjs()}
                  format="DD/MM/YYYY"
                />
              </Box>
            </Box>

            {/* Description Field */}
            <AscendTextFieldControlled
              name="description"
              control={control}
              label="Description"
              placeholder="Enter audience description"
            />
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
          disabled={createAudienceMutation.isPending || isLoading}
        >
          {createAudienceMutation.isPending ? "Creating..." : "Create"}
        </AscendButton>
      </Box>
    </Box>
  );
}
