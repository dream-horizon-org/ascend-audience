import { useState, useEffect, useRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { type SxProps, type Theme } from "@mui/material/styles";
import AscendTextField from "../AscendTextField/AscendTextField";
import { useDebounce } from "../../utils/useDebounce";

interface AscendAutoCompletePaginatedProps<T extends FieldValues, OptionType> {
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
  // Paginated props
  options: OptionType[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  // Optional search props (if provided, enables search functionality)
  onSearch?: (searchTerm: string) => void;
  onSearchReset?: () => void; // Called when search is cleared to reset pagination
  getOptionLabel: (option: OptionType) => string;
  getOptionValue: (option: OptionType) => string;
  debounceMs?: number;
  minCharsToSearch?: number;
  enableSearch?: boolean; // Explicitly enable/disable search
}

function AscendAutoCompletePaginated<T extends FieldValues, OptionType>({
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
  options,
  loading,
  hasMore,
  onLoadMore,
  onSearch,
  onSearchReset,
  getOptionLabel,
  getOptionValue,
  debounceMs = 300,
  minCharsToSearch = 0,
  enableSearch = !!onSearch, // Auto-enable if onSearch is provided
}: AscendAutoCompletePaginatedProps<T, OptionType>) {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, debounceMs);
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const prevSearchTermRef = useRef("");

  // Wrapper functions to handle both string and OptionType
  const safeGetOptionLabel = (option: string | OptionType): string => {
    if (typeof option === "string") {
      return option;
    }
    return getOptionLabel(option as OptionType);
  };

  const safeGetOptionValue = (option: string | OptionType): string => {
    if (typeof option === "string") {
      return option;
    }
    return getOptionValue(option as OptionType);
  };

  // Handle search with pagination reset
  useEffect(() => {
    if (!enableSearch || !onSearch) return;

    const currentTerm = debouncedSearchTerm.trim();
    const prevTerm = prevSearchTermRef.current;

    // If search term changed
    if (currentTerm !== prevTerm) {
      if (currentTerm.length >= minCharsToSearch) {
        // New search - this should reset pagination in parent
        onSearch(currentTerm);
      } else if (prevTerm && !currentTerm) {
        // Search cleared - reset to initial state
        onSearchReset?.();
      }
      prevSearchTermRef.current = currentTerm;
    }
  }, [debouncedSearchTerm, onSearch, onSearchReset, minCharsToSearch, enableSearch]);

  // Handle scroll for pagination
  const handleListboxScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget as HTMLUListElement;
    const scrollTop = listboxNode.scrollTop;
    const scrollHeight = listboxNode.scrollHeight;
    const clientHeight = listboxNode.clientHeight;

    // Load more when scrolled near bottom (within 50px)
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !loading) {
      onLoadMore();
    }
  };

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
            value={
              multiple
                ? options.filter((opt) => {
                    const valueArray = Array.isArray(value) ? value : [];
                    return (valueArray as string[]).includes(safeGetOptionValue(opt));
                  })
                : options.find((opt) => safeGetOptionValue(opt) === value) || null
            }
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(_, newValue) => {
              if (!disabled) {
                if (multiple) {
                  // For multiple selection, convert array of objects to array of values
                  onChange(
                    Array.isArray(newValue)
                      ? newValue.map((item) => safeGetOptionValue(item))
                      : []
                  );
                } else {
                  // For single selection, convert object to value
                  onChange(newValue ? safeGetOptionValue(newValue as string | OptionType) : null);
                }
              }
            }}
            disabled={disabled}
            loading={loading}
            size="small"
            fullWidth
            popupIcon={<KeyboardArrowDownIcon />}
            getOptionLabel={safeGetOptionLabel}
            isOptionEqualToValue={(option, value) => {
              return safeGetOptionValue(option) === safeGetOptionValue(value);
            }}
            ListboxProps={{
              onScroll: handleListboxScroll,
              ref: listboxRef,
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={safeGetOptionLabel(option)}
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
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  {safeGetOptionLabel(option)}
                </li>
              );
            }}
            ListboxComponent={(props) => (
              <ul {...props}>
                {props.children}
                {hasMore && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 1,
                    }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                )}
              </ul>
            )}
            // Client-side filtering disabled when search is enabled
            filterOptions={enableSearch ? (x) => x : undefined}
            noOptionsText={
              enableSearch && minCharsToSearch > 0 && inputValue.length < minCharsToSearch
                ? `Type ${minCharsToSearch} or more characters to search`
                : "No options found"
            }
          />
        </div>
      )}
    />
  );
}

export default AscendAutoCompletePaginated;

