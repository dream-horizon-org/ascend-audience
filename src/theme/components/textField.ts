import type { Components, Theme } from "@mui/material/styles";

export const muiTextField: Components<Theme>["MuiTextField"] = {
  defaultProps: {
    size: "small",
    fullWidth: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: theme.shape.borderRadius,
        "& fieldset": {
          borderColor: theme.palette.textField.border,
        },
        "&:hover fieldset": {
          borderColor: theme.palette.textField.border,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.textField.borderFocus,
          borderWidth: "1px",
        },
        "&.Mui-error fieldset": {
          borderColor: theme.palette.error.main,
        },
        "&.Mui-error:hover fieldset": {
          borderColor: theme.palette.error.dark,
        },
        "&.Mui-error.Mui-focused fieldset": {
          borderColor: theme.palette.error.main,
          borderWidth: "1px",
        },
        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
          cursor: "not-allowed",
        },
      },
      "& .MuiOutlinedInput-input": {
        color: theme.palette.text.primary,
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
          WebkitTextFillColor: theme.palette.text.disabled,
        },
      },
    }),
  },
};

