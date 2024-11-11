import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  userValidationSchema,
  updateUserValidationSchema,
} from "../../validators/user.validations";
import FormLayout from "../../layout/FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../redux/Slices/Master/RolesSlice";

const UserForm = ({
  onSubmit,
  initialData = {},
  loading,
  onCancel,
  isEdit = false,
}) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles({ pageSize: 5, page: 1 }));
  }, [dispatch]);

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
      email: "",
      mobileNum: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(
      isEdit ? updateUserValidationSchema : userValidationSchema
    ),
  });

  // Watch field values
  const nameValue = watch("name");
  const emailValue = watch("email");
  const mobileNumValue = watch("mobileNum");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      reset({
        name: initialData?.name || "",
        email: initialData?.email || "",
        mobileNum: initialData?.mobileNum || "",
        password: "",
        confirmPassword: "",
        role: initialData?.role?.key || "",
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
          Name <span className="startColor">*</span>
        </label>
        <TextField
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="formInput"
          fullWidth
          disabled={isEdit || loading}
          label="Enter Name"
          variant="outlined"
          InputLabelProps={{ shrink: !!nameValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Email ID <span className="startColor">*</span>
        </label>
        <TextField
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="formInput"
          type="email"
          fullWidth
          label="Enter Email"
          disabled={isEdit || loading}
          variant="outlined"
          InputLabelProps={{ shrink: !!emailValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <label className="formLabel">
          Phone No. <span className="startColor">*</span>
        </label>
        <TextField
          {...register("mobileNum")}
          error={!!errors.mobileNum}
          helperText={errors.mobileNum?.message}
          className="formInput"
          fullWidth
          disabled={loading}
          label="Enter Phone No."
          variant="outlined"
          InputLabelProps={{ shrink: !!mobileNumValue }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Role <span className="startColor">*</span>
        </label>
        <FormControl fullWidth className="formInput">
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                error={!!errors.role}
                label="Select Role"
                labelId="role-select-label"
                id="role-select"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roles?.map((role) => (
                  <MenuItem key={role._id} value={role.key}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          {errors.role && (
            <FormHelperText error>{errors.role?.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {!isEdit && (
        <>
          <Grid item xs={6}>
            <label className="formLabel">
              Password <span className="startColor">*</span>
            </label>
            <TextField
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              className="formInput"
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
            />
          </Grid>

          <Grid item xs={6}>
            <label className="formLabel">
              Confirm Password <span className="startColor">*</span>
            </label>
            <TextField
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              type="password"
              className="formInput"
              fullWidth
              label="Confirm Password"
              variant="outlined"
            />
          </Grid>
        </>
      )}
    </FormLayout>
  );
};

export default UserForm;
