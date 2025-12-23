import { Control, Controller, FieldValues, Path } from "react-hook-form";
import AscendSelect, { type Option } from "./AscendSelect";
import { SelectProps } from "@mui/material";

type AscendSelectControlledProps<T extends FieldValues> = Omit<
  SelectProps,
  "name" | "label"
> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  placeholder?: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  onChangeCustom?: (value: string | number) => void;
};

function AscendSelectControlled<T extends FieldValues>({
  name,
  control,
  onChangeCustom,
  ...props
}: AscendSelectControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AscendSelect
          {...field}
          {...props}
          onChange={(e) => {
            field.onChange(e);
            if (onChangeCustom) {
              onChangeCustom(e.target.value as string | number);
            }
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}

export default AscendSelectControlled;
