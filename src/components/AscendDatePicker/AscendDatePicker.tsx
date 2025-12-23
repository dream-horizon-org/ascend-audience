import { FC } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface AscendDatePickerProps {
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  error?: boolean;
  helperText?: string;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  disabled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  format?: string;
}

const AscendDatePicker: FC<AscendDatePickerProps> = ({
  label,
  infoText,
  required = false,
  className = "",
  width,
  error,
  helperText,
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  format = "DD/MM/YYYY",
}) => {
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Tooltip title={infoText} arrow>
              <InfoOutlinedIcon
                sx={{
                  fontSize: theme.customComponents.textField.icon.fontSize,
                  color: theme.customComponents.textField.icon.color,
                }}
                className="cursor-pointer hover:opacity-80"
              />
            </Tooltip>
          )}
        </div>

        <DatePicker
          value={value || null}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          format={format}
          slots={{
            openPickerIcon: disabled ? () => null : undefined,
          }}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: error,
              helperText: helperText,
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default AscendDatePicker;

