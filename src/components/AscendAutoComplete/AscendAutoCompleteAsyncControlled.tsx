import { useState, useEffect } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import { type SxProps, type Theme } from "@mui/material/styles";
import AscendTextField from "../AscendTextField/AscendTextField";
import { useDebounce } from "../../utils/useDebounce";

interface AscendAutoCompleteAsyncControlledProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  infoText?: string;
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  filterSelectedOptions?: boolean;
  className?: string;
  chipStyles?: SxProps<Theme>;
  disabled?: boolean;
  // Async search props
  onSearch: (searchTerm: string) => Promise<string[]>;
  initialOptions?: string[];
  debounceMs?: number;
  minCharsToSearch?: number;
}

function AscendAutoCompleteAsyncControlled<T extends FieldValues>({
  name,
  control,
  label,
  infoText,
  required = false,
  placeholder,
  multiple = false,
  freeSolo = false,
  filterSelectedOptions = false,
  className = "",
  chipStyles,
  disabled = false,
  onSearch,
  initialOptions = [],
  debounceMs = 300,
  minCharsToSearch = 3,
}: AscendAutoCompleteAsyncControlledProps<T>) {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    // If search term is less than minimum chars, use initial options
    if (debouncedSearchTerm.length < minCharsToSearch) {
      setOptions(initialOptions);
      return;
    }

    // Perform API search
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const results = await onSearch(debouncedSearchTerm);
        setOptions(results);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedSearchTerm, onSearch, initialOptions, minCharsToSearch]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={`flex flex-col w-full ${className}`}>
          <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            filterSelectedOptions={filterSelectedOptions}
            options={options}
            value={value || (multiple ? [] : null)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(_, newValue) => {
              if (!disabled) {
                onChange(newValue);
              }
            }}
            disabled={disabled}
            loading={loading}
            size="small"
            fullWidth
            popupIcon={<KeyboardArrowDownIcon />}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    deleteIcon={<CloseIcon />}
                    sx={chipStyles}
                  />
                );
              })
            }
            renderInput={(params) => (
              <AscendTextField
                {...params}
                label={label || ""}
                infoText={infoText}
                required={required}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            // Client-side filtering disabled since we're doing server-side search
            filterOptions={(x) => x}
            noOptionsText={
              inputValue.length < minCharsToSearch
                ? `Type ${minCharsToSearch} or more characters to search`
                : "No options found"
            }
          />
        </div>
      )}
    />
  );
}

export default AscendAutoCompleteAsyncControlled;

