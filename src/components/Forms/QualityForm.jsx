import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { qualitySchema } from "../../validators/qualityValidations";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
   CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import FormLayout from "../../layout/FormLayout";
import { generateQualityCode } from "../../utils/helper";
import { fetchService } from "../../redux/Slices/Master/ServiceSlice";
import { fetchQualityUnits } from "../../redux/Slices/Master/QualityUnits";

const QualityForm = ({
  onSubmit,
  initialData = {},
  isEdit = false,
  loading,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const {
    productCategories,
    processes,
    lustres,
    qualities,
    shadePrefixes,
    denierPrefix,
    filamentPrefix,
    plyPrefix,
  } = useSelector((state) => state.qualityUnits);
  const { allServices } = useSelector((state) => state.service);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productCateg: "",

      denierPrefix, // non changeable prefix
      denier: isEdit ? "" : 1,

      filamentPrefix, // non changeable prefix
      filament: isEdit ? "" : 1,

      plyPrefix, // non changeable prefix
      ply: isEdit ? "" : 1,

      process: "",
      tpm:  0,

      isLub : "",

      serviceId: "",
      lustre: isEdit ?  "" : "SD",

      shadePrefix: isEdit ? "" : "RW",
      shade: "",

      qualityAbbr: isEdit ? "" : "1ST", // select quality

      qualityCode: "", // disabled field
      qualityCodeManual: "",
      ...initialData,
    },
    resolver: yupResolver(qualitySchema),
  });

  // console.log(initialData);

  useEffect(() => {
    dispatch(fetchService({ pageSize: 5, page: 1 }));
    dispatch(fetchQualityUnits());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        qualityAbbr: initialData?.qualityAbbr || "",
        qualityCode: initialData?.qualityCode || "",
        qualityCodeManual: initialData?.qualityCodeManual || "",
        productCateg: initialData?.productCateg || "",
        denierPrefix: initialData?.denierPrefix || "",
        denier: initialData?.denier || "",
        filamentPrefix: initialData?.filamentPrefix || "",
        filament: initialData?.filament || "",
        plyPrefix: initialData?.plyPrefix || "",
        ply: initialData?.ply || "",
        process: initialData?.process || "",
        tpm: initialData?.tpm || "",
        isLub: initialData?.isLub || false,
        lustre: initialData?.lustre || "",
        shadePrefix: initialData?.shadePrefix || "",
        shade: initialData?.shade || "",
        serviceId: initialData?.serviceId?._id || "",
      });
    }
  }, [isEdit, initialData, reset]);

  const watchedFields = watch([
    "qualityAbbr",
    "productCateg",
    "denier",
    "filament",
    "ply",
    "lustre",
    "shadePrefix",
    "shade",
    "process",
    "tpm",
    "isLub",

  ]);

  useEffect(() => {
    const [
      qualityAbbr,
      productCateg,
      denier,
      filament,
      ply,
      lustre,
      shadePrefix,
      shade,
      process,
      tpm,
      isLub,
    ] = watchedFields;

    const qualityData = {
      qualityAbbr,
      productCateg,
      denierPrefix,
      denier,
      filamentPrefix,
      filament,
      plyPrefix,
      ply,
      lustre,
      shadePrefix,
      shade,
      process,
      tpm,
      isLub,
    };
    const qualityCode = generateQualityCode(qualityData);
    setValue("qualityCode", qualityCode);
    if (!isEdit) setValue("qualityCodeManual", qualityCode);
    if (!["TW", "HB", "TWHK"].includes(process)) setValue("tpm", 0);
    if (shadePrefix === "RW") setValue("shade", "");
  }, watchedFields);

  return (
    <FormLayout
      onCancel={onCancel}
      loading={loading}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Product Category */}
      <Grid item xs={12}>
        <label className="formLabel">
          Product Category<span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.productCateg}>
          <InputLabel>Product Category</InputLabel>
          <Controller
            name="productCateg"
            control={control}
            disabled={loading}
            render={({ field }) => (
              <Select {...field} label="Product Category">
                {productCategories?.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.productCateg && (
            <FormHelperText>{errors.productCateg.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Denier */}
      <Grid item xs={6}>
        <label className="formLabel">
          Denier prefix<span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          className="mt-3"
          label="Denier prefix"
          {...register("denierPrefix")}
          error={!!errors.denierPrefix}
          helperText={errors.denierPrefix?.message}
          disabled
          InputLabelProps={{ shrink: !!watch("denierPrefix") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Denier <span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          className="mt-3"
          label="Denier"
          {...register("denier")}
          error={!!errors.denier}
          helperText={errors.denier?.message}
          InputLabelProps={{ shrink: !!watch("denier") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Filament */}
      <Grid item xs={6}>
        <label className="formLabel">
          Filament prefix<span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          className="mt-3"
          label="Filament prefix"
          {...register("filamentPrefix")}
          error={!!errors.filamentPrefix}
          helperText={errors.filamentPrefix?.message}
          disabled
          InputLabelProps={{ shrink: !!watch("filamentPrefix") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Filament <span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          className="mt-3"
          label="Filament"
          {...register("filament")}
          error={!!errors.filament}
          helperText={errors.filament?.message}
          InputLabelProps={{ shrink: !!watch("filament") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Ply */}
      <Grid item xs={6}>
        <label className="formLabel">
          Ply prefix<span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          className="mt-3"
          label="Ply prefix"
          {...register("plyPrefix")}
          error={!!errors.plyPrefix}
          helperText={errors.plyPrefix?.message}
          disabled
          InputLabelProps={{ shrink: !!watch("plyPrefix") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Ply <span className="startColor">*</span>
        </label>

        <TextField
          fullWidth
          className="mt-3"
          label="Ply"
          {...register("ply")}
          error={!!errors.ply}
          helperText={errors.ply?.message}
          InputLabelProps={{ shrink: !!watch("ply") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Process and TPM */}
      <Grid item xs={6}>
        <label className="formLabel">
          Process <span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.process}>
          <InputLabel>Process</InputLabel>
          <Controller
            name="process"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Process">
                {processes?.map((process, index) => (
                  <MenuItem key={index} value={process}>
                    {process}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.process && (
            <FormHelperText>{errors.process.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">TPM</label>
        <TextField
          fullWidth
          className="mt-3"
          label="TPM"
          {...register("tpm")}
          error={!!errors.tpm}
          helperText={errors.tpm?.message}
          disabled={!["TW", "HB", "TWHK"].includes(watch("process"))}
          InputLabelProps={{ shrink: !!watch("process") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Lubrication */}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Controller
              name="isLub"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} />
              )}
            />
          }
          label="Is Lubricated?"
        />
      </Grid>

      {/* Service Name and Lustre */}
      <Grid item xs={6}>
        <label className="formLabel">
          Service Name <span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.serviceId}>
          <InputLabel>Service Name</InputLabel>
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Service Name">
                {allServices?.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.serviceId && (
            <FormHelperText>{errors.serviceId.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Lustre <span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.lustre}>
          <InputLabel>Lustre</InputLabel>
          <Controller
            name="lustre"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Lustre">
                {lustres?.map((lustre, index) => (
                  <MenuItem key={index} value={lustre}>
                    {lustre}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.lustre && (
            <FormHelperText>{errors.lustre.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Shade prefix and Shade */}
      <Grid item xs={6}>
        <label className="formLabel">
          Shade prefix <span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.shadePrefix}>
          <InputLabel>Shade prefix</InputLabel>
          <Controller
            name="shadePrefix"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Shade prefix">
                {shadePrefixes?.map((prefix, index) => (
                  <MenuItem key={index} value={prefix}>
                    {prefix}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.shadePrefix && (
            <FormHelperText>{errors.shadePrefix.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <label className="formLabel">
          Shade <span className="startColor">*</span>
        </label>
        <TextField
          fullWidth
          label="Shade"
          className="mt-3"
          {...register("shade")}
          error={!!errors.shade}
          helperText={errors.shade?.message}
          disabled={watch("shadePrefix") === "RW"}
           InputLabelProps={{ shrink: !!watch("shade") }}
           InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Quality */}
      <Grid item xs={12}>
        <label className="formLabel">
          Enter / Select Quality <span className="startColor">*</span>
        </label>
        <FormControl className="mt-3" fullWidth error={!!errors.qualityAbbr}>
          <InputLabel>Quality</InputLabel>
          <Controller
            name="qualityAbbr"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Quality">
                {qualities?.map((quality, index) => (
                  <MenuItem key={index} value={quality}>
                    {quality}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.qualityAbbr && (
            <FormHelperText>{errors.qualityAbbr.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Quality Code */}
      <Grid item xs={12}>
        <label className="formLabel">Quality Code</label>
        <TextField
          fullWidth
          className="mt-3"
          label="Quality Code"
          {...register("qualityCode")}
          error={!!errors.qualityCode}
          helperText={errors.qualityCode?.message}
          disabled
          InputLabelProps={{ shrink: !!watch("qualityCode") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>

      {/* Quality Code Manual */}
      <Grid item xs={12}>
        <label className="formLabel">Quality Code Manual</label>
        <TextField
          fullWidth
          className="mt-3"
          label="Quality Code Manual"
          {...register("qualityCodeManual")}
          error={!!errors.qualityCodeManual}
          helperText={errors.qualityCodeManual?.message}
          InputLabelProps={{ shrink: !!watch("qualityCodeManual") }}
          InputProps={{
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
      </Grid>
    </FormLayout>
  );
};

export default QualityForm;
