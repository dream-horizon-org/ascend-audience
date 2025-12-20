import { Control, Controller, FieldValues, Path } from "react-hook-form";
import AscendTextField from "./AscendTextField";
import { type TextFieldProps } from "@mui/material/TextField";

type AscendTextFieldControlledProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name"
> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  onChangeCustom?: (value: string) => void;
};

function AscendTextFieldControlled<T extends FieldValues>({
  name,
  control,
  onChangeCustom,
  ...props
}: AscendTextFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AscendTextField
          {...field}
          {...props}
          onChange={(e) => {
            field.onChange(e);
            if (onChangeCustom) {
              onChangeCustom(e.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}

export default AscendTextFieldControlled;
