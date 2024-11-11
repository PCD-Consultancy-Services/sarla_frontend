import React, { useEffect } from "react";
import {
  TextField,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { machineSchema } from "../../validators/machineValidation";
import FormLayout from "../../layout/FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchService } from "../../redux/Slices/Master/ServiceSlice";

const MachineForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const dispatch = useDispatch();
  const { allServices } = useSelector((state) => state.service);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
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

  const nameValue = watch("name");
  const nylonKgValue = watch("nylonKg");
  const literageValue = watch("literage");
  const nylonRatioValue = watch("nylonRatio");

  useEffect(() => {
    dispatch(fetchService({ pageSize: 10, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData?.name || "",
        serviceId: initialData?.serviceId._id || "",
        nylonKg: initialData?.nylonKg || "",
        literage: initialData?.literage || "",
        nylonRatio: initialData?.nylonRatio || "",
      });
    }
  }, [initialData, reset]);

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
          InputLabelProps={{ shrink: !!nameValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Service Name <span className="startColor">*</span>
        </label>
        <FormControl fullWidth className="formInput">
          <InputLabel id="service-select-label">Select Service Name</InputLabel>
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                // value={field.value}
                error={!!errors.serviceId}
                label="Select Service Name"
              >
                {allServices?.map((data) => (
                  <MenuItem key={data._id} value={data._id}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.serviceId && (
            <FormHelperText error>{errors.serviceId.message}</FormHelperText>
          )}
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
          InputLabelProps={{ shrink: !!nylonKgValue }}
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
          InputLabelProps={{ shrink: !!literageValue }}
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
          InputLabelProps={{ shrink: !!nylonRatioValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
    </FormLayout>
  );
};

export default MachineForm;
