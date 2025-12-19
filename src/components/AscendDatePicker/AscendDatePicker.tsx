import { FC } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
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
  const styles = theme.customComponents.ascendTextField;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`flex flex-col ${width ? "" : "w-full"} ${className}`}
        style={{ width }}
      >
        <div className="flex items-center gap-1 mb-1">
          <label
            className="leading-4 font-inter"
            style={{
              fontSize: styles.label.fontSize,
              fontWeight: styles.label.fontWeight,
              color: styles.label.color,
            }}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>

          {infoText && (
            <Tooltip title={infoText} arrow>
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

        <DatePicker
          value={value || null}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          format={format}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: error,
              helperText: helperText,
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: styles.border.radius,
                  "& fieldset": {
                    borderColor: error ? undefined : styles.border.color,
                  },
                  "&:hover fieldset": {
                    borderColor: error ? undefined : styles.border.color,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: error ? undefined : styles.border.focusColor,
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: styles.input.textColor,
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default AscendDatePicker;

