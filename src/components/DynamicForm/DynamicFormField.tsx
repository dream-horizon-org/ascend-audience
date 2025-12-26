import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import AscendTextField from "../AscendTextField/AscendTextField";
import AscendSelect from "../AscendSelect/AscendSelect";
import { ConnectorTypeProperty } from "../../network/queries";

interface DynamicFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  property: ConnectorTypeProperty;
  label: string;
  required: boolean;
}

function DynamicFormField<T extends FieldValues>({
  name,
  control,
  property,
  label,
  required,
}: DynamicFormFieldProps<T>) {
  // Handle enum types (dropdown)
  if (property.enum && property.enum.length > 0) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <AscendSelect
            {...field}
            label={label}
            required={required}
            infoText={property.description}
            options={property.enum!.map((option: string) => ({
              label: option,
              value: option,
            }))}
            error={!!error}
            helperText={error?.message}
            value={field.value || property.default || ""}
          />
        )}
      />
    );
  }

  // Handle boolean types (checkbox)
  if (property.type === "boolean") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value !== undefined ? field.value : (property.default || false)}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label={label}
            />
            {property.description && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: "block" }}>
                {property.description}
              </Typography>
            )}
          </Box>
        )}
      />
    );
  }

  // Handle integer types
  if (property.type === "integer") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <AscendTextField
            {...field}
            type="number"
            label={label}
            required={required}
            infoText={property.description}
            error={!!error}
            helperText={error?.message}
            fullWidth
            size="small"
            value={field.value !== undefined && field.value !== null ? field.value : (property.default || "")}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === "" ? undefined : parseInt(value, 10));
            }}
          />
        )}
      />
    );
  }

  // Handle object types (show as JSON textarea with better formatting)
  if (property.type === "object") {
    const placeholder = property.additionalProperties 
      ? `e.g. {"key1": "value1", "key2": "value2"}`
      : "Enter JSON object";
    
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          // Convert object to formatted JSON string for display
          const displayValue = typeof field.value === "object" && field.value !== null
            ? JSON.stringify(field.value, null, 2)
            : field.value || "";

          return (
            <AscendTextField
              label={label}
              required={required}
              infoText={property.description}
              error={!!error}
              helperText={error?.message}
              fullWidth
              size="small"
              multiline
              rows={4}
              placeholder={placeholder}
              value={displayValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                
                // If empty, set to undefined or empty object based on requirement
                if (!inputValue.trim()) {
                  field.onChange(required ? {} : undefined);
                  return;
                }

                try {
                  const parsed = JSON.parse(inputValue);
                  field.onChange(parsed);
                } catch {
                  // Keep the string value while user is typing
                  field.onChange(inputValue);
                }
              }}
              onBlur={(e) => {
                // On blur, validate and clean up the JSON
                const inputValue = e.target.value;
                if (!inputValue.trim()) {
                  field.onChange(required ? {} : undefined);
                  return;
                }
                
                try {
                  const parsed = JSON.parse(inputValue);
                  field.onChange(parsed);
                } catch {
                  // If invalid JSON on blur, try to show error or reset
                  field.onChange({});
                }
                field.onBlur();
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                },
              }}
            />
          );
        }}
      />
    );
  }

  // Default: string type
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AscendTextField
          {...field}
          label={label}
          required={required}
          infoText={property.description}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size="small"
        />
      )}
    />
  );
}

export default DynamicFormField;

