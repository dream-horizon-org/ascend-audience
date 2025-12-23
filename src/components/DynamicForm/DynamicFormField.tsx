import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
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
          <TextField
            {...field}
            select
            label={label}
            required={required}
            error={!!error}
            helperText={error?.message || property.description}
            fullWidth
            size="small"
          >
            {property.enum!.map((option: string) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
                  checked={field.value || false}
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
          <TextField
            {...field}
            type="number"
            label={label}
            required={required}
            error={!!error}
            helperText={error?.message || property.description}
            fullWidth
            size="small"
            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
          />
        )}
      />
    );
  }

  // Handle object types (for now, show as JSON textarea)
  if (property.type === "object") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={label}
            required={required}
            error={!!error}
            helperText={error?.message || property.description || "Enter JSON object"}
            fullWidth
            size="small"
            multiline
            rows={3}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                field.onChange(parsed);
              } catch {
                field.onChange(e.target.value);
              }
            }}
            value={typeof field.value === "object" ? JSON.stringify(field.value, null, 2) : field.value}
          />
        )}
      />
    );
  }

  // Default: string type
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          required={required}
          error={!!error}
          helperText={error?.message || property.description}
          fullWidth
          size="small"
        />
      )}
    />
  );
}

export default DynamicFormField;

