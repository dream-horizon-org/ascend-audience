import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import PageHeader from "../../components/PageHeader/PageHeader";
import AscendTextFieldControlled from "../../components/AscendTextField/AscendTextFieldControlled";
import AscendAutoCompleteAsyncControlled from "../../components/AscendAutoComplete/AscendAutoCompleteAsyncControlled";
import AscendDatePickerControlled from "../../components/AscendDatePicker/AscendDatePickerControlled";
import AscendButton from "../../components/AscendButton/AscendButton";

// Zod validation schema
const audienceSchema = z.object({
  audienceName: z
    .string()
    .min(3, "Audience name must be at least 3 characters")
    .nonempty("Audience name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nonempty("Description is required"),
  destinations: z
    .array(z.string())
    .min(1, "Please select at least one destination"),
  validTill: z
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
  const { control, handleSubmit } = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      audienceName: "",
      description: "",
      destinations: [],
      validTill: undefined,
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Initial destination options (first 10)
  const initialDestinations = [
    "Facebook Ads",
    "Google Ads",
    "Email Campaign",
    "SMS Marketing",
    "Push Notifications",
    "Slack",
    "Webhook",
    "Twitter Ads",
    "LinkedIn Ads",
    "Instagram Ads",
  ];

  // Mock search function - Replace with actual API call
  const searchDestinations = async (searchTerm: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data - Replace with actual API call
    const allDestinations = [
      "Facebook Ads",
      "Google Ads",
      "Email Campaign",
      "SMS Marketing",
      "Push Notifications",
      "Slack",
      "Webhook",
      "Twitter Ads",
      "LinkedIn Ads",
      "Instagram Ads",
      "TikTok Ads",
      "Snapchat Ads",
      "Pinterest Ads",
      "Reddit Ads",
      "YouTube Ads",
      "WhatsApp",
      "Telegram",
      "Discord",
      "Mailchimp",
      "SendGrid",
    ];

    // Filter based on search term
    return allDestinations.filter((dest) =>
      dest.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* Replace above with actual API call:
    try {
      const response = await apiClient.get('/destinations/search', {
        params: { q: searchTerm, limit: 10 },
      });
      return response.data.destinations;
    } catch (error) {
      console.error('Error searching destinations:', error);
      return [];
    }
    */
  };

  const onSubmit = (data: AudienceFormData) => {
    console.log("Form Data:", data);
    // Handle form submission here
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
                  name="audienceName"
                  control={control}
                  label="Audience Name"
                  placeholder="Enter audience name"
                  infoText="A unique identifier for your audience"
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AscendDatePickerControlled
                  name="validTill"
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

            {/* Destination Autocomplete with Async Search */}
            <AscendAutoCompleteAsyncControlled
              name="destinations"
              control={control}
              label="Destination"
              placeholder="Type to search destinations"
              onSearch={searchDestinations}
              initialOptions={initialDestinations}
              minCharsToSearch={3}
              debounceMs={300}
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
        >
          Create
        </AscendButton>
      </Box>
    </Box>
  );
}
