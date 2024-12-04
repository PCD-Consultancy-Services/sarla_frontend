import React, { useState, useRef, useCallback } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import debounce from "lodash.debounce";

const SearchableAutocomplete = ({
  fieldName,
  dispatch,
  searchAction,
  options = [],
  loading = false,
  valueResolver,
  setValue,
  errors,
  label,
  getOptionLabel,
  customOnChange,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const loadingRef = useRef(false);

  const selectedValue = valueResolver();
  const isValueSelected = Boolean(selectedValue);

  // Create a debounced function with the latest `searchAction`
  const debouncedSearch = useCallback(
    debounce((query, size) => {
      dispatch(searchAction({ name: query, pageSize: size }));
    }, 300),
    [dispatch, searchAction]
  );

  const handleSearchChange = (event, value) => {
    const searchValue = value.includes(" - ") ? value.split(" - ")[0].trim() : value;
  
    if (!isValueSelected) {
      setSearchQuery(searchValue);
      setIsSearching(!!searchValue);
  
      if (searchValue.trim()) {
        // Use the current pageSize for API calls
        debouncedSearch(searchValue, pageSize);
      } else {
        // Reset only when clearing the input
        setPageSize(10);
        dispatch(searchAction({ pageSize: 10 }));
      }
    }
  };;

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const scrollPercentage = (listboxNode.scrollTop + listboxNode.clientHeight) / listboxNode.scrollHeight;

    if (scrollPercentage > 0.99 && !loadingRef.current) {
      loadingRef.current = true;

      setTimeout(() => {
        const newPageSize = pageSize + 10;
        setPageSize(newPageSize);

        if (isSearching) {
          debouncedSearch(searchQuery, newPageSize);
        } else {
          dispatch(searchAction({ pageSize: newPageSize }));
        }

        loadingRef.current = false;
      }, 500);
    }
  };

  const defaultOnChange = (_, newValue) => {
    if (!newValue) {
      setValue(fieldName, "", { shouldValidate: true });
      setSearchQuery("");
      setIsSearching(false);
      setPageSize(10);
      dispatch(searchAction({ pageSize: 10 }));
    } else {
      setValue(fieldName, newValue._id || "", { shouldValidate: true });
    }
  };

  const renderOption = (props, option) => (
    <li {...props}>
      {getOptionLabel ? getOptionLabel(option) : option?.name}
    </li>
  );

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => (getOptionLabel ? getOptionLabel(option) : option?.name) || ""}
      isOptionEqualToValue={(option, value) => option._id === value}
      value={selectedValue}
      disabled={loading || disabled}
      onInputChange={handleSearchChange}
      onChange={customOnChange || defaultOnChange}
      loading={loading}
      loadingText="Loading..."
      ListboxProps={{
        onScroll: handleScroll,
        style: { maxHeight: 250 },
      }}
      renderOption={renderOption}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={Boolean(errors?.[fieldName]?.message)}
          helperText={errors?.[fieldName]?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            readOnly: isValueSelected,
          }}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: isValueSelected ? "rgba(0, 0, 0, 0.05)" : "transparent",
            },
          }}
        />
      )}
    />
  );
};

export default SearchableAutocomplete;
