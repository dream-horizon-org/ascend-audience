import type { Components, Theme } from "@mui/material/styles";

export const muiLink: Components<Theme>["MuiLink"] = {
  styleOverrides: {
    root: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      color: "#0060E5",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
        color: "#00429E",
      },
      "&.Mui-disabled": {
        color: "#CACBCE",
      },
    },
  },
};

