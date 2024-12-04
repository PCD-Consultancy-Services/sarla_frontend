import React, { useEffect } from "react";
import { TextField, Grid, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { serviceSchema } from "../../validators/serviceValidation";
import FormLayout from "../../layout/FormLayout";
import Loader from "../Loader";

const ServiceForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(serviceSchema),
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData?.name || "",
      });
    }else{
      reset({
        name:  "",
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
    <FormLayout onSubmit={handleSubmit(onSubmit)} onCancel={onCancel} loading={loading}>
      <Grid item xs={6}>
        <label className="formLabel">
          Service Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Service Name"
          variant="outlined"
          InputLabelProps={{ shrink: !!nameValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
    </FormLayout>
  );
};

export default ServiceForm