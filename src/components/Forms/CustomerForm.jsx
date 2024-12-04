import React, { useEffect } from "react";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomerValidationSchema } from "../../validators/customerValidation";
import FormLayout from "../../layout/FormLayout";
import Loader from "../Loader";

const CustomerForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CustomerValidationSchema),
  });

  const nameValue = watch("name");
  const custCodeValue = watch("custCode");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData.name || "",
        custCode: initialData.custCode || "",
      });
    } else {
      reset({
        name: "",
        custCode: "",
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
          Customer Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={loading}
          InputLabelProps={{ shrink: !!nameValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
          className="formInput"
          fullWidth
          label="Enter Customer Name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Customer Code <span className="startColor">*</span>
        </label>
        <TextField
          {...register("custCode")}
          error={!!errors.custCode}
          helperText={errors.custCode?.message}
          disabled={loading}
          InputLabelProps={{ shrink: !!custCodeValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
          className="formInput"
          fullWidth
          label="Enter Customer Code"
          variant="outlined"
        />
      </Grid>
    </FormLayout>
  );
};

export default CustomerForm;
