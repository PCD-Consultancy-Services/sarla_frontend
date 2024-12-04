import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ShadeValidationSchema } from "../../validators/shadeValidation";
import FormLayout from "../../layout/FormLayout";
import { useDispatch } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { searchShade } from "../../redux/Slices/Execution/ShadeSlice";
import Loader from "../Loader";

const ShadeForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ShadeValidationSchema),
  });

  // State for Autocomplete options
  const [shadeOptions, setShadeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [shadeInputValue, setShadeInputValue] = useState("");
  const [colorInputValue, setColorInputValue] = useState("");

  const [activeInput, setActiveInput] = useState(null);

  const dispatch = useDispatch();
  const debouncedShadeInputValue = useDebounce(shadeInputValue);
  const debouncedColorInputValue = useDebounce(colorInputValue);

  // Fetch initial data if provided
  useEffect(() => {
    if (initialData && Object.keys(initialData)?.length) {
      reset({
        shadeCode: initialData.shadeCode || "",
        color: initialData.color || "",
      });
      setShadeInputValue(initialData.shadeCode || "");
      setColorInputValue(initialData.color || "");
    }
  }, [initialData, reset]);

  // Fetch shade options on input change
  useEffect(() => {
    if (
      activeInput === "shade" &&
      debouncedShadeInputValue?.trim().length > 0
    ) {
      dispatch(
        searchShade({ shadeCode: debouncedShadeInputValue.trim() })
      ).then((action) => {
        if (action.payload) {
          setShadeOptions(action.payload.data.results || []);
        }
      });
    } else {
      setShadeOptions([]);
    }
  }, [debouncedShadeInputValue, activeInput, dispatch]);

  useEffect(() => {
    if (
      activeInput === "color" &&
      debouncedColorInputValue?.trim().length > 0
    ) {
      dispatch(searchShade({ color: debouncedColorInputValue.trim() })).then(
        (action) => {
          if (action.payload) {
            const uniqueColors = [];
            const seenColors = new Set();
            (action.payload.data.results || []).forEach((item) => {
              if (!seenColors.has(item.color)) {
                uniqueColors.push(item);
                seenColors.add(item.color);
              }
            });
            setColorOptions(uniqueColors);
          }
        }
      );
    } else {
      setColorOptions([]);
    }
  }, [debouncedColorInputValue, activeInput, dispatch]);

  // Fetch color options on input change
  useEffect(() => {
    if (activeInput === "color" && debouncedColorInputValue?.length > 1) {
      dispatch(searchShade({ color: debouncedColorInputValue?.trim() })).then(
        (action) => {
          if (action.payload) {
            const uniqueColors = [];
            const seenColors = new Set();
            action.payload.data.results.forEach((item) => {
              if (!seenColors.has(item.color)) {
                uniqueColors.push(item);
                seenColors.add(item.color);
              }
            });
            setColorOptions(uniqueColors);
          }
        }
      );
    } else {
      setColorOptions([]);
    }
  }, [debouncedColorInputValue, activeInput, dispatch]);

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <FormLayout
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      loading={loading}
    >
      <Grid container spacing={2}>
        {/* Searchable Shade Code */}
        <Grid item xs={6}>
          <label className="formLabel">
            Shade Code <span className="startColor">*</span>
          </label>
          <Autocomplete
            freeSolo
            options={shadeOptions}
            getOptionLabel={(option) => (option?.shadeCode || "").toString()}
            inputValue={shadeInputValue || ""}
            onInputChange={(event, newValue) => {
              setShadeInputValue(newValue || "");
              setActiveInput("shade");
            }}
            onChange={(event, value) => {
              const shadeCode = value?.shadeCode || shadeInputValue;
              setValue("shadeCode", shadeCode);
              setShadeInputValue(shadeCode);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register("shadeCode")}
                error={!!errors.shadeCode}
                helperText={errors.shadeCode?.message}
                disabled={loading}
                className="mt-3"
                label="Enter Shade Code"
                variant="outlined"
                InputLabelProps={{ shrink: !!watch("shadeCode") }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: loading && <CircularProgress size={20} />,
                }}
              />
            )}
          />
        </Grid>

        {/* Searchable Shade Color */}
        <Grid item xs={6}>
          <label className="formLabel">
            Shade Color <span className="startColor">*</span>
          </label>
          <Autocomplete
            freeSolo
            options={colorOptions}
            getOptionLabel={(option) => option.color || ""}
            inputValue={colorInputValue || ""}
            onInputChange={(event, newValue) => {
              setColorInputValue(newValue || ""); // Handle empty or null value
              setActiveInput("color");
            }}
            onChange={(event, value) => {
              const color = value?.color || colorInputValue; // Fallback to input value
              setValue("color", color || ""); // Avoid undefined
              setColorInputValue(color || ""); // Ensure valid fallback
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register("color")}
                error={!!errors.color}
                helperText={errors.color?.message}
                disabled={loading}
                className="mt-3"
                label="Enter Shade Color"
                variant="outlined"
                InputLabelProps={{ shrink: !!watch("color") }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: loading && <CircularProgress size={20} />,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default ShadeForm;
