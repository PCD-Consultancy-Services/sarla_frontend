import React, { useEffect } from "react";
import { TextField, Grid, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tankValidationSchema } from "../../validators/tankValidation";
import FormLayout from "../../layout/FormLayout";
import Loader from "../Loader";

const TankForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tankValidationSchema),
  });

  const nameValue = watch("name");
  const solenoid_S_Value = watch("solenoid_S");
  const solenoid_L_Value = watch("solenoid_L");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData.name || "",
        solenoid_S: initialData.solenoid_S || "",
        solenoid_L: initialData.solenoid_L || "",
      });
    } else {
      reset({
        name: "",
        solenoid_S: "",
        solenoid_L: "",
      });
    }
  }, [initialData, reset]);

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
          Tank Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Tank Name"
          variant="outlined"
          InputLabelProps={{ shrink: !!nameValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">Solenoid_S</label>
        <TextField
          {...register("solenoid_S")}
          error={!!errors.solenoid_S}
          helperText={errors.solenoid_S?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Solenoid_S"
          variant="outlined"
          InputLabelProps={{ shrink: !!solenoid_S_Value }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">Solenoid_L</label>
        <TextField
          {...register("solenoid_L")}
          error={!!errors.solenoid_L}
          helperText={errors.solenoid_L?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Solenoid_L"
          variant="outlined"
          InputLabelProps={{ shrink: !!solenoid_L_Value }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
    </FormLayout>
  );
};

export default TankForm;
