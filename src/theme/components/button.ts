import type { Components, Theme } from "@mui/material/styles";

export const muiButton: Components<Theme>["MuiButton"] = {
  styleOverrides: {
    root: {
      fontFamily: "Inter, sans-serif",
      textTransform: "none",
      borderRadius: "4px",
      fontWeight: 700,
    },
    contained: {
      backgroundColor: "#0074E8",
      color: "#F5F5F5",
      "&:hover": {
        backgroundColor: "#0057AD",
        color: "#F5F5F5",
      },
      "&:active": {
        backgroundColor: "#57ABFF",
      },
      "&.Mui-disabled": {
        backgroundColor: "#D9D9D9",
        color: "#C2C2C2",
      },
    },
    outlined: {
      borderColor: "#57ABFF",
      borderWidth: "1px",
      color: "#57ABFF",
      "&:hover": {
        backgroundColor: "#0057AD",
        color: "#F5F5F5",
        borderColor: "#0057AD",
      },
      "&:active": {
        backgroundColor: "#57ABFF",
      },
      "&.Mui-disabled": {
        backgroundColor: "#D9D9D9",
        color: "#C2C2C2",
        borderColor: "#D9D9D9",
      },
    },
    text: {
      color: "#57ABFF",
      "&:hover": {
        backgroundColor: "#0057AD",
        color: "#F5F5F5",
      },
      "&:active": {
        backgroundColor: "#57ABFF",
      },
      "&.Mui-disabled": {
        backgroundColor: "#D9D9D9",
        color: "#C2C2C2",
      },
    },
    sizeSmall: {
      padding: "0.25rem 0.75rem",
    },
    sizeMedium: {
      padding: "0.25rem 1rem",
    },
    sizeLarge: {
      padding: "0.5rem 1rem",
    },
  },
};
