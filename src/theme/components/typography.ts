import type { Components, Theme } from "@mui/material/styles";

export const muiTypography: Components<Theme>["MuiTypography"] = {
  variants: [
    {
      props: { variant: "label" },
      style: ({ theme }: { theme: Theme }) => ({
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: "1rem",
        color: theme.customComponents.textField.label.color,
      }),
    },
  ],
};

