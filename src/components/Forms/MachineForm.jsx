import React, { useEffect, useState, useCallback } from "react";
import {
  TextField,
  Grid,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { machineSchema } from "../../validators/machineValidation";
import FormLayout from "../../layout/FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchService, searchService } from "../../redux/Slices/Master/ServiceSlice";
import SearchableAutocomplete from "../SearchableAutoComplete";
import Loader from "../Loader";

const MachineForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const dispatch = useDispatch();
  const { allServices } = useSelector((state) => state.service);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      nylonKg: "",
      serviceId: "",
      nylonRatio: "",
      literage: "",
    },
    resolver: yupResolver(machineSchema),
  });

  // Load initial form data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData?.name || "",
        serviceId: initialData?.serviceId?._id || "",
        nylonKg: initialData?.nylonKg || "",
        literage: initialData?.literage || "",
        nylonRatio: initialData?.nylonRatio || "",
      });
    } else {
      reset({
        name: "",
        serviceId: "",
        nylonKg: "",
        literage: "",
        nylonRatio: "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    dispatch(fetchService({ pageSize: 10, page: 1 }));
  }, [dispatch]);

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
      
      <Grid item xs={6}>
        <label className="formLabel">
          Machine Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Machine Name"
          variant="outlined"
          InputLabelProps={{ shrink: !!watch("name") }}
        />
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Service Name <span className="startColor">*</span>
        </label>
        <FormControl fullWidth className="formInput">
        <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <SearchableAutocomplete
                {...field}
                control={control}
                fieldName="serviceId"
                dispatch={dispatch}
                searchAction={searchService}
                options={allServices}
                loading={loading}
                valueResolver={() =>
                  // Logic to resolve the initial value
                  allServices?.find((service) => service._id === watch("serviceId")) ||
                  (watch("serviceId")
                    ? {
                        _id: watch("serviceId"),
                        name: initialData?.serviceId?.name || "Original Service",
                      }
                    : null)
                }
                setValue={setValue}
                errors={errors}
                label="Select Service"
              />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Nylon Kg <span className="startColor">*</span>
        </label>
        <TextField
          {...register("nylonKg")}
          error={!!errors.nylonKg}
          helperText={errors.nylonKg?.message}
          className="formInput"
          fullWidth
          label="Enter Nylon Kg"
          variant="outlined"
          InputLabelProps={{ shrink: !!watch("nylonKg") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Literage <span className="startColor">*</span>
        </label>
        <TextField
          {...register("literage")}
          error={!!errors.literage}
          helperText={errors.literage?.message}
          className="formInput"
          fullWidth
          label="Enter Literage"
          id="fullWidth"
          variant="outlined"
          InputLabelProps={{ shrink: !!watch("literage") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Nylon Ratio <span className="startColor">*</span>
        </label>
        <TextField
          {...register("nylonRatio")}
          error={!!errors.nylonRatio}
          helperText={errors.nylonRatio?.message}
          className="formInput"
          fullWidth
          label="Enter Nylon Ratio"
          variant="outlined"
          InputLabelProps={{ shrink: !!watch("nylonRatio") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
    </FormLayout>
  );
};

export default MachineForm;