import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  onBack: () => void;
  children?: ReactNode;
}

const PageHeader = ({ title, onBack, children }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <IconButton onClick={onBack} aria-label="go back">
        <ArrowBackIcon
          sx={{
            color: "#595959",
            fontSize: "1rem",
          }}
        />
      </IconButton>
      <Typography
        component="h1"
        sx={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "1rem",
          color: "#333333",
        }}
      >
        {title}
      </Typography>
      {children && (
        <Box sx={{ marginLeft: "auto" }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;

