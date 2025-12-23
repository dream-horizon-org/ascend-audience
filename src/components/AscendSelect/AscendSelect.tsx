import { FC } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface Option {
  label: string;
  value: string | number;
}

type AscendSelectProps = Omit<SelectProps, "label"> & {
  label: string;
  options: Option[];
  placeholder?: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  error?: boolean;
  helperText?: string;
};

const AscendSelect: FC<AscendSelectProps> = ({
  label,
  options,
  placeholder,
  infoText,
  required = false,
  className = "",
  width,
  error = false,
  helperText,
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const styles = theme.customComponents.textField;

  return (
    <div
      className={`flex flex-col ${width ? "" : "w-full"} ${className}`}
      style={{ width }}
    >
      <div className="flex items-center gap-1 mb-1">
        <Typography variant="label" component="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Typography>

        {infoText && (
          <Tooltip title={infoText}>
            <InfoOutlinedIcon
              sx={{
                fontSize: styles.icon.fontSize,
                color: styles.icon.color,
              }}
              className="w-4 h-4 leading-[100%] cursor-pointer hover:opacity-80"
            />
          </Tooltip>
        )}
      </div>

      <FormControl fullWidth size="small" error={error} disabled={disabled}>
        <Select
          {...props}
          displayEmpty={!!placeholder}
          sx={{
            backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#d32f2f" : "#DADADD",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#d32f2f" : "#DADADD",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#d32f2f" : "#1976d2",
              borderWidth: "1px",
            },
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default AscendSelect;

