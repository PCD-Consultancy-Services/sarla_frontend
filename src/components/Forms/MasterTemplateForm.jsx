import React, { useEffect } from "react";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { masterTemplateSchema } from "../../validators/masterTemplateValidation";
import FormLayout from "../../layout/FormLayout";
import Loader from "../Loader";

const MasterTemplateForm = ({
  onSubmit,
  initialData = {},
  loading,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(masterTemplateSchema),
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData.name || "",
      });
    }else {
      reset({
        name: "",
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
          Template Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Template Name"
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

export default MasterTemplateForm;
