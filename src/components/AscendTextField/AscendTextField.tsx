import { FC } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

type AscendTextFieldProps = Omit<
  TextFieldProps,
  "label"
> & {
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
};

const AscendTextField: FC<AscendTextFieldProps> = ({
  label,
  infoText,
  required = false,
  className = "",
  width,
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

      <TextField {...props} />
    </div>
  );
};

export default AscendTextField;
