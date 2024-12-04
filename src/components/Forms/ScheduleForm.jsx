import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  fetchShadeForSchedule,
  fetchQualityForSchedule,
  fetchCustomerForSchedule,
  fetchRecipeTypeForSchedule,
  fetchRecipeIdForSchedule,
} from "../../redux/Slices/Execution/RecipeForSchdule";
import { scheduleValidationSchema } from "../../validators/scheduleValidation";
import { removeDuplicates } from "../../utils/removeDuplicateData";
import {
  fetchCardBatches,
} from "../../redux/Slices/Execution/scheduleSlice";
import FormLayout from "../../layout/FormLayout";
import { getSlipNumByCardBatch } from "../../redux/Slices/Execution/SlipNumSlice";
import {
  searchMacineForExecution,
} from "../../redux/Slices/Master/MachineSlice";
import SearchableAutocomplete from "../SearchableAutoComplete";
import { fetchShade, searchShade } from "../../redux/Slices/Execution/ShadeSlice";
import Loader from "../Loader";

const ScheduleForm = ({ onSubmit, initialValues = {}, onCancel }) => {
  const dispatch = useDispatch();

  const { loading, cardBatches } = useSelector((state) => state.schedule);

  const { allMachine } = useSelector((state) => state.machine);
  const { allShade } = useSelector((state) => state.shade);

  const {
    loading: isSlipLoading,
    error: slipError,
    slipNumber,
  } = useSelector((state) => state.slipNum);

  const {
    shades,
    qualities,
    customers,
    recipeTypes,
    // recipeId,
    loading: isRecipeLoading,
  } = useSelector((state) => state.receipeForSchedule);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      PINo: "",
      machineId: "",
      cardBatch: "",
      shadeId: "",
      qualityId: "",
      customerId: "",
      recipeType: "",
      finishMaterial: "",
      RMLotNum: "",
      slipNumber: "",
      batchWt: "",
      cones: "",
      remarks: "",
      programNum: "",
    },
    resolver: yupResolver(scheduleValidationSchema),
  });

  useEffect(() => {
    // dispatch(fetchMachines());
    dispatch(fetchCardBatches());
    // dispatch(fetchShadeForSchedule({}));

    // come from machine slice
    dispatch(searchMacineForExecution({}));
    dispatch(searchShade({}))
  }, [dispatch]);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length) {
      reset({
        PINo: initialValues?.piNo,
        machineId: initialValues?.machineId._id,
        cardBatch: initialValues?.cardBatche,
        RMLotNum: initialValues?.rmLotNumber,
        finishMaterial: initialValues?.finishMaterial,
        shadeId: initialValues?.shadeId._id,
        qualityId: initialValues?.qualityId?._id,
        customerId: initialValues?.customerId?._id,
        recipeType: initialValues?.recipeType,
        // recipeId: schedule?.recipeId,
        rmMaterial: initialValues?.qualityId?._id,
        slipNumber: initialValues?.slipNumber,
        batchWt: initialValues?.batchWeight,
        cones: initialValues?.cones,
        remarks: initialValues?.remark,
        programNum: initialValues?.programNo,
      });
    } else {
      reset({
        PINo: "",
        machineId: "",
        cardBatch: "",
        RMLotNum: "",
        finishMaterial: "",
        shadeId: "",
        qualityId: "",
        customerId: "",
        recipeType: "",
        // recipeId: schedule?.recipeId,
        rmMaterial: "",
        slipNumber: "",
        batchWt: "",
        cones: "",
        remarks: "",
        programNum: "",
      });
    }
  }, [initialValues, reset]);
  // console.log(initialValues)

  const shadeId = watch("shadeId");
  const qualityId = watch("qualityId");
  const customerId = watch("customerId");
  const recipeType = watch("recipeType");
  // const selectedBatch = watch("cardBatch");

  // useEffect(() => {
  //   if (selectedBatch) {
  //     setValue("slipNumber", selectedBatch);
  //   }
  // }, [selectedBatch, setValue]);

  const fetchSlipNumber = async (selectedBatch) => {
    if (selectedBatch) {
      const response = await dispatch(getSlipNumByCardBatch(selectedBatch));
      // console.log(response)
      if (response.payload) {
        setValue("slipNumber", response.payload);
      }
    }
  };

  // useEffect(() => {
  //   if (!slipNumber) {
  //     fetchSlipNumber();
  //   }
  // }, [selectedBatch, dispatch, slipNumber, setValue]);

  useEffect(() => {
    if (shadeId) {
      dispatch(fetchQualityForSchedule({ shadeId }));
    }
    if (shadeId && qualityId) {
      dispatch(fetchCustomerForSchedule({ shadeId, qualityId }));
    }
    if (shadeId && qualityId && customerId) {
      dispatch(fetchRecipeTypeForSchedule({ shadeId, qualityId, customerId }));
    }
    if (shadeId && qualityId && customerId && recipeType) {
      dispatch(
        fetchRecipeIdForSchedule({ shadeId, qualityId, customerId, recipeType })
      );
    }
  }, [shadeId, qualityId, customerId, recipeType, dispatch]);

  useEffect(() => {
    // Cascading resets based on dependent field selections
    if (!shadeId) {
      // If no shade is selected, reset quality, customer, and recipe type
      setValue('qualityId', '');
      setValue('customerId', '');
      setValue('recipeType', '');
      
      // Clear fetched data for dependent fields
      dispatch(fetchQualityForSchedule({})); // Reset qualities
      dispatch(fetchCustomerForSchedule({})); // Reset customers
      dispatch(fetchRecipeTypeForSchedule({})); // Reset recipe types
    }
    
    if (shadeId && !qualityId) {
      // If shade is selected but no quality, reset customer and recipe type
      setValue('customerId', '');
      setValue('recipeType', '');
      
      // Fetch qualities based on shade
      dispatch(fetchQualityForSchedule({ shadeId }));
      
      // Clear fetched data for dependent fields
      dispatch(fetchCustomerForSchedule({}));
      dispatch(fetchRecipeTypeForSchedule({}));
    }
    
    if (shadeId && qualityId && !customerId) {
      // If shade and quality are selected but no customer, reset recipe type
      setValue('recipeType', '');
      
      // Fetch customers based on shade and quality
      dispatch(fetchCustomerForSchedule({ shadeId, qualityId }));
      
      // Clear fetched recipe types
      dispatch(fetchRecipeTypeForSchedule({}));
    }
    
    // Original fetching logic
    if (shadeId && qualityId && customerId) {
      dispatch(fetchRecipeTypeForSchedule({ shadeId, qualityId, customerId }));
    }
  }, [shadeId, qualityId, customerId, dispatch, setValue]);

  const uniqueQualities = removeDuplicates(qualities || [], "qualityId");
  const uniqueCustomers = removeDuplicates(customers || [], "customerId");
  const uniqueShades = removeDuplicates(shades || [], "shadeId");

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
        <Grid item xs={6}>
          <label className="formLabel">
            PI No. <span className="startColor">*</span>
          </label>
          <TextField
            {...register("PINo")}
            error={!!errors.PINo}
            helperText={errors.PINo?.message}
            fullWidth
            className="mt-3"
            label="PI No."
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("PINo") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Machine <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <Controller
              name="machineId"
              control={control}
              render={({ field }) => (
                <SearchableAutocomplete
                  {...field}
                  control={control}
                  fieldName="machineId"
                  dispatch={dispatch}
                  searchAction={searchMacineForExecution}
                  options={allMachine}
                  loading={loading}
                  valueResolver={() =>
                    // Logic to resolve the initial value
                    allMachine?.find((mac) => mac._id === watch("machineId")) ||
                    (watch("machineId")
                      ? {
                          _id: watch("machineId"),
                          name:
                            initialValues?.machineId?.name ||
                            "Original Service",
                        }
                      : null)
                  }
                  setValue={setValue}
                  errors={errors}
                  label="Select Machine"
                />
              )}
            />
          </FormControl>
          {/* <Controller
              name="machineId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Select Machine">
                  {loading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    machineNames.map((machine) => (
                      <MenuItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
            />
            {errors.machineId && (
              <FormHelperText>{errors.machineId.message}</FormHelperText>
            )} */}
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Card Batch <span className="startColor">*</span>
          </label>
          <FormControl className="mt-3" fullWidth error={!!errors.cardBatch}>
            <InputLabel>Select Card Batch</InputLabel>
            <Controller
              name="cardBatch"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={(e) => {
                    // Update the selected value in form state
                    field.onChange(e);
                    // Set selected batch and call the fetchSlipNumber function
                    const selectedBatch = e.target.value;
                    fetchSlipNumber(selectedBatch); // Pass selectedBatch to your function
                  }}
                  label="Select Card Batch"
                >
                  {cardBatches?.map((batch, index) => (
                    <MenuItem key={index} value={batch}>
                      {batch}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.cardBatch && (
              <FormHelperText>{errors.cardBatch.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            RM Lot Number <span className="startColor">*</span>
          </label>
          <TextField
            {...register("RMLotNum")}
            error={!!errors.RMLotNum}
            helperText={errors.RMLotNum?.message}
            fullWidth
            className="mt-3"
            label="RM Lot Number"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("RMLotNum") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Shade <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <SearchableAutocomplete
                  {...field}
                  control={control}
                  fieldName="shadeId"
                  dispatch={dispatch}
                  searchAction={searchShade}
                  options={allShade}
                  getOptionLabel={(option) =>
                    `${option.shadeCode} - ${option.color}` || ""
                  }
                  loading={loading}
                  valueResolver={() =>
                    // Logic to resolve the initial value
                    allShade?.find((sh) => sh._id === watch("shadeId")) ||
                    (watch("shadeId")
                      ? {
                          _id: initialValues?.shadeId?._id,
                          shadeCode: initialValues?.shadeId?.shadeCode,
                          color: initialValues?.shadeId?.color,
                        }
                      : null)
                  }
                  setValue={setValue}
                  errors={errors}
                  label="Select Shade"
                />
              )}
            />
          </FormControl>
          {/* <Controller
            name="shadeId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={uniqueShades}
                getOptionLabel={(option) =>
                  `${option.shadeId?.shadeCode} - ${option.shadeId?.color}` ||
                  ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="mt-3"
                    label="Select Shade"
                    error={!!errors.shadeId}
                    helperText={errors.shadeId?.message}
                  />
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue?.shadeId?._id || null)
                }
                value={
                  shades?.find((shade) => shade.shadeId?._id === field.value) ||
                  null
                }
              />
            )}
          /> */}
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Finish Material<span className="startColor">*</span>
          </label>
          <TextField
            {...register("finishMaterial")}
            error={!!errors.finishMaterial}
            helperText={errors.finishMaterial?.message}
            fullWidth
            className="mt-3"
            label="Finish Material"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("finishMaterial") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            RM Material (Quality)<span className="startColor">*</span>
          </label>
          <Controller
            name="qualityId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={uniqueQualities}
                getOptionLabel={(option) =>
                  `${option?.qualityId?.qualityCode} - ${option.qualityId?.qualityCodeManual}` ||
                  ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select RM Material"
                    className="mt-3"
                    error={!!errors.qualityId}
                    helperText={errors.qualityId?.message}
                  />
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue?.qualityId?._id || null)
                }
                value={
                  qualities?.find(
                    (quality) => quality?.qualityId?._id === field.value
                  ) || null
                }
                disabled={!shadeId}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Customer<span className="startColor">*</span>
          </label>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={uniqueCustomers}
                getOptionLabel={(option) =>
                  `${option?.customerId?.name} - ${option.customerId?.custCode}` ||
                  ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="mt-3"
                    label="Select Customer"
                    error={!!errors.customerId}
                    helperText={errors.customerId?.message}
                  />
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue?.customerId?._id || null)
                }
                value={
                  customers?.find(
                    (cust) => cust?.customerId?._id === field.value
                  ) || null
                }
                disabled={!qualityId || isRecipeLoading}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Slip Number <span className="startColor">*</span>
          </label>
          <TextField
            {...register("slipNumber")}
            error={!!errors.slipNumber}
            helperText={errors.slipNumber?.message}
            fullWidth
            label="Slip Number"
            className="mt-3"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("slipNumber") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Batch Weight <span className="startColor">*</span>
          </label>
          <TextField
            {...register("batchWt")}
            error={!!errors.batchWt}
            helperText={errors.batchWt?.message}
            fullWidth
            className="mt-3"
            label="Batch Weight"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("batchWt") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Cones <span className="startColor">*</span>
          </label>
          <TextField
            {...register("cones")}
            error={!!errors.cones}
            helperText={errors.cones?.message}
            fullWidth
            className="mt-3"
            label="Cones"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("cones") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Remarks <span className="startColor">*</span>
          </label>
          <TextField
            {...register("remarks")}
            error={!!errors.remarks}
            helperText={errors.remarks?.message}
            fullWidth
            className="mt-3"
            label="Remarks"
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("remarks") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Program No. <span className="startColor">*</span>
          </label>
          <TextField
            {...register("programNum")}
            error={!!errors.programNum}
            helperText={errors.programNum?.message}
            fullWidth
            className="mt-3"
            label="Program No."
            variant="outlined"
            InputLabelProps={{ shrink: !!watch("programNum") }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Receipe Type <span className="startColor">*</span>
          </label>
          <Controller
            name="recipeType"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={recipeTypes || []}
                getOptionLabel={(option) => option.recipeType || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="mt-3"
                    label="Select Receipe Type"
                    error={!!errors.recipeType}
                    helperText={errors.recipeType?.message}
                  />
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue ? newValue.recipeType : "")
                }
                value={
                  recipeTypes.find((type) => type.recipeType === field.value) ||
                  null
                }
                disabled={!customerId}
              />
            )}
          />
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default ScheduleForm;
