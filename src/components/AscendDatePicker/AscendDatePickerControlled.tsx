import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Dayjs } from "dayjs";
import AscendDatePicker from "./AscendDatePicker";

type AscendDatePickerControlledProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  disabled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  format?: string;
};

function AscendDatePickerControlled<T extends FieldValues>({
  name,
  control,
  label,
  infoText,
  required = false,
  className = "",
  width,
  disabled = false,
  minDate,
  maxDate,
  format = "DD/MM/YYYY",
}: AscendDatePickerControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <AscendDatePicker
          label={label}
          infoText={infoText}
          required={required}
          className={className}
          width={width}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          format={format}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}

export default AscendDatePickerControlled;

