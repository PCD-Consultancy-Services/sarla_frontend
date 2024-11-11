import React, { useEffect } from "react";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classificationSchema } from "../../validators/classificationValidation";
import FormLayout from "../../layout/FormLayout";

const ClassifictionForm = ({
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
    resolver: yupResolver(classificationSchema),
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData.name || "",
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
          Classification Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Classification Name"
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

export default ClassifictionForm;
