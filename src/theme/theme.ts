import { createTheme } from "@mui/material/styles";
import { muiTextField, muiTypography, muiTooltip } from "./components";

type CustomSpacing = {
  appBarHeight: string;
  sidebarWidth: string;
  contentPadding: string;
};

type CustomComponents = {
  appBar: {
    height: string;
    padding: string;
    logoSize: string;
    logoBorderRadius: string;
    titleFontSize: string;
    titleFontWeight: number;
    linkFontSize: string;
    linkFontWeight: number;
    linkPadding: string;
    innerHeight: string;
  };
  sidebar: {
    width: string;
    tabSize: string;
    tabPadding: string;
    indicatorWidth: string;
    indicatorBorderRadius: string;
    iconSize: string;
  };
  textField: {
    label: {
      color: string;
    };
    icon: {
      color: string;
      fontSize: string;
    };
  };
  dropdown: {
    sm: string;
    md: string;
    lg: string;
    chipSmallHeight: string;
    chipMediumHeight: string;
    chipLimit1: number;
    chipLimit2: number;
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  table: {
    rowHeight: string;
    cellPadding: string;
    fontSize: string;
    borderColor: string;
    borderRadius: string;
  };
  status: {
    live: {
      background: string;
      color: string;
    };
    draft: {
      background: string;
      color: string;
    };
    completed: {
      background: string;
      color: string;
    };
    paused: {
      background: string;
      color: string;
    };
    archived: {
      background: string;
      color: string;
    };
    concluded: {
      background: string;
      color: string;
    };
    terminated: {
      background: string;
      color: string;
    };
  };
  chip: {
    height: string;
    borderRadius: string;
    background: string;
    text: string;
    fontSize: string;
  };
  actions: {
    delete: string;
    shadow: string;
  };
};

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
    border: {
      main: string;
    };
    textField: {
      border: string;
      borderFocus: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
    border?: {
      main: string;
    };
    textField?: {
      border: string;
      borderFocus: string;
    };
  }
  interface TypographyVariants {
    label: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
  interface Theme {
    customSpacing: CustomSpacing;
    customComponents: CustomComponents;
  }
  interface ThemeOptions {
    customSpacing?: Partial<CustomSpacing>;
    customComponents?: Partial<CustomComponents>;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0060E5",
      light: "#E3F2FD",
      dark: "#003F9E",
    },
    secondary: {
      main: "#dc004e",
    },
    text: {
      primary: "#212121",
      secondary: "#666",
      disabled: "#454854",
    },
    background: {
      default: "#F8F9FC",
      paper: "#FFFFFF",
    },
    action: {
      disabled: "#e6e8f2",
      disabledBackground: "#e6e8f2",
    },
    divider: "#E0E0E0",
    neutral: {
      main: "#33343E",
      light: "#9AA5B1",
      dark: "#454854",
    },
    border: {
      main: "#DADADD",
    },
    textField: {
      border: "#DADADD",
      borderFocus: "#4A4B54",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  shape: {
    borderRadius: 2,
  },
  customSpacing: {
    appBarHeight: "56px",
    sidebarWidth: "48px",
    contentPadding: "20px",
  },
  customComponents: {
    appBar: {
      height: "56px",
      padding: "12px",
      logoSize: "18px",
      logoBorderRadius: "4px",
      titleFontSize: "18px",
      titleFontWeight: 600,
      linkFontSize: "16px",
      linkFontWeight: 600,
      linkPadding: "4px 12px",
      innerHeight: "24px",
    },
    sidebar: {
      width: "48px",
      tabSize: "48px",
      tabPadding: "12px",
      indicatorWidth: "4px",
      indicatorBorderRadius: "0 4px 4px 0",
      iconSize: "24px",
    },
    textField: {
      label: {
        color: "#828592",
      },
      icon: {
        color: "#33343E",
        fontSize: "1rem",
      },
    },
    dropdown: {
      sm: "28px",
      md: "32px",
      lg: "40px",
      chipSmallHeight: "20px",
      chipMediumHeight: "24px",
      chipLimit1: 5,
      chipLimit2: 3,
      borderRadius: {
        sm: "0px",
        md: "12px",
        lg: "999px",
      },
    },
    table: {
      rowHeight: "48px",
      cellPadding: "0 16px",
      fontSize: "14px",
      borderColor: "#DADADD",
      borderRadius: "1px",
    },
    status: {
      live: {
        background: "#A5D6A7",
        color: "#212121",
      },
      draft: {
        background: "#FFCC80",
        color: "#212121",
      },
      completed: {
        background: "#CE93D8",
        color: "#212121",
      },
      paused: {
        background: "#BDBDBD",
        color: "#212121",
      },
      archived: {
        background: "#EF9A9A",
        color: "#212121",
      },
      concluded: {
        background: "#D1C4E9",
        color: "#212121",
      },
      terminated: {
        background: "#EF9A9A",
        color: "#212121",
      },
    },
    chip: {
      height: "32px",
      borderRadius: "4px",
      background: "#E1E3EA",
      text: "#33343E",
      fontSize: "11px",
    },
    actions: {
      delete: "#C62828",
      shadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  components: {
    MuiTextField: muiTextField,
    MuiTypography: muiTypography,
    MuiTooltip: muiTooltip,
  },
});
