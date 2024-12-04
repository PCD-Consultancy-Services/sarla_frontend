import React, { useEffect } from "react";
import FormLayout from "../../layout/FormLayout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChemicalValidationSchema } from "../../validators/chemicalValidations";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchChemicalsUnits } from "../../redux/Slices/Master/ChemicalUnitsSlice";
import { fetchTanks, searchTank } from "../../redux/Slices/Master/TankSlice";
import {
  fetchClassification,
  searchClassification,
} from "../../redux/Slices/Master/ClassificationSlice";
import SearchableAutocomplete from "../SearchableAutoComplete";
import Loader from "../Loader";

const ChemicalForm = ({ onSubmit, initialData = {}, loading, onCancel }) => {
  const dispatch = useDispatch();

  const {
    consumptionUnits,
    phUnits,
    densityUnits,
    conductivityUnits,
    viscosityUnits,
  } = useSelector((state) => state.chemicalUnits);

  const { allClassification } = useSelector((state) => state.classification);

  const { allTanks } = useSelector((state) => state.tanks);

  useEffect(() => {
    // fetch chemical units
    dispatch(fetchChemicalsUnits());
    // fetch all tanks (pagination wise)
    dispatch(fetchTanks({ pageSize: 10, page: 1 }));
    // fetch all clasification (pagination wise)
    dispatch(fetchClassification({ pageSize: 10, page: 1 }));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      materialCode: "",
      classifId: "",
      tankId: "",
      fluidState: "",
      minConsumption: "",
      maxConsumption: "",
      consumptionUnit: "",
      ph: "",
      phUnit: "",
      density: "",
      densityUnit: "",
      conductivity: "",
      conductivityUnit: "",
      viscosity: "",
      viscosityUnit: "",
    },
    resolver: yupResolver(ChemicalValidationSchema),
  });

  //===================WATCH VALUES ====================================
  const name = watch("name");
  const materialCode = watch("materialCode");
  const fluidState = watch("fluidState");
  const minConsumption = watch("minConsumption");
  const maxConsumption = watch("maxConsumption");
  const ph = watch("ph");
  const density = watch("density");
  const conductivity = watch("conductivity");
  const viscosity = watch("viscosity");
  //====================================================================

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        name: initialData.name || "",
        materialCode: initialData.materialCode || "",
        classifId: initialData.classifId._id || "",
        tankId: initialData.tankId._id || "",
        fluidState: initialData.fluidState || "",
        minConsumption: initialData.minConsumption || "",
        maxConsumption: initialData.maxConsumption || "",
        consumptionUnit: initialData.consumptionUnit || "",
        ph: initialData.ph || "",
        phUnit: initialData.phUnit || "",
        density: initialData.density || "",
        densityUnit: initialData.densityUnit || "",
        conductivity: initialData.conductivity || "",
        conductivityUnit: initialData.conductivityUnit || "",
        viscosity: initialData.viscosity || "",
        viscosityUnit: initialData.viscosityUnit || "",
      });
    } else {
      reset({
        name: "",
        materialCode: "",
        classifId: "",
        tankId: "",
        fluidState: "",
        minConsumption: "",
        maxConsumption: "",
        consumptionUnit: "",
        ph: "",
        phUnit: "",
        density: "",
        densityUnit: "",
        conductivity: "",
        conductivityUnit: "",
        viscosity: "",
        viscosityUnit: "",
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
      <Grid
        container
        spacing={2}
        bgcolor={"white"}
        borderRadius={"15px"}
        padding={"20px"}
      >
        <Grid item xs={6}>
          <label className="formLabel">
            Chemical Name <span className="startColor">*</span>
          </label>
          <TextField
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            className="formInput"
            fullWidth
            label="Enter Chemical Name"
            variant="outlined"
            InputLabelProps={{ shrink: !!name }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Material Code <span className="startColor">*</span>
          </label>
          <TextField
            {...register("materialCode")}
            error={!!errors.materialCode}
            helperText={errors.materialCode?.message}
            className="formInput"
            fullWidth
            label="Enter Material Code"
            variant="outlined"
            InputLabelProps={{ shrink: !!materialCode }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Classification Name <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <Controller
              name="classifId"
              control={control}
              render={({ field }) => (
                <SearchableAutocomplete
                  {...field}
                  control={control}
                  fieldName="classifId"
                  dispatch={dispatch}
                  searchAction={searchClassification}
                  options={allClassification}
                  loading={loading}
                  valueResolver={() =>
                    // Logic to resolve the initial value
                    allClassification?.find(
                      (classification) => classification._id === watch("classifId")
                    ) ||
                    (watch("classifId")
                      ? {
                          _id: watch("classifId"),
                          name:
                            initialData?.classifId?.name || "Original classi",
                        }
                      : null)
                  }
                  setValue={setValue}
                  errors={errors}
                  label="Select Classification"
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Tank Name <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
        <Controller
            name="tankId"
            control={control}
            render={({ field }) => (
              <SearchableAutocomplete
                {...field}
                control={control}
                fieldName="tankId"
                dispatch={dispatch}
                searchAction={searchTank}
                options={allTanks}
                loading={loading}
                valueResolver={() =>
                  // Logic to resolve the initial value
                  allTanks?.find((service) => service._id === watch("tankId")) ||
                  (watch("tankId")
                    ? {
                        _id: watch("tankId"),
                        name: initialData?.tankId?.name || "Original tank",
                      }
                    : null)
                }
                setValue={setValue}
                errors={errors}
                label="Select Tank"
              />
            )}
          />
        </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Fluid State <span className="startColor">*</span>
          </label>
          <TextField
            {...register("fluidState")}
            error={!!errors.fluidState}
            helperText={errors.fluidState?.message}
            className="formInput"
            fullWidth
            label="Enter Fluid State"
            variant="outlined"
            InputLabelProps={{ shrink: !!fluidState }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Minimum Consumption <span className="startColor">*</span>
          </label>
          <TextField
            {...register("minConsumption")}
            error={!!errors.minConsumption}
            helperText={errors.minConsumption?.message}
            className="formInput"
            fullWidth
            label="Enter Minimum Consumption"
            id="minimumConsumption"
            variant="outlined"
            InputLabelProps={{ shrink: !!minConsumption }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Maximum Consumption <span className="startColor">*</span>
          </label>
          <TextField
            {...register("maxConsumption")}
            error={!!errors.maxConsumption}
            helperText={errors.maxConsumption?.message}
            className="formInput"
            fullWidth
            label="Enter Maximum Consumption"
            id="maximumConsumption"
            variant="outlined"
            InputLabelProps={{ shrink: !!maxConsumption }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Consumption Unit <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <InputLabel id="consumption-unit-select-label">
              Select Consumption Unit
            </InputLabel>
            <Controller
              name="consumptionUnit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={!!errors.consumptionUnit}
                  label="Select Consumption Unit"
                  labelId="consumption-unit-select-label"
                  InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                  }}
                >
                  {consumptionUnits?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.consumptionUnit && (
              <FormHelperText error>
                {errors.consumptionUnit?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            PH <span className="startColor">*</span>
          </label>
          <TextField
            {...register("ph")}
            error={!!errors.ph}
            helperText={errors.ph?.message}
            className="formInput"
            fullWidth
            label="Enter PH"
            id="ph"
            variant="outlined"
            InputLabelProps={{ shrink: !!ph }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select PH Unit <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <InputLabel id="ph-unit-select-label">Select PH Unit</InputLabel>
            <Controller
              name="phUnit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={!!errors.phUnit}
                  label="Select PH Unit"
                  labelId="ph-unit-select-label"
                  InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                  }}
                >
                  {phUnits?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.phUnit && (
              <FormHelperText error>{errors.phUnit?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Density <span className="startColor">*</span>
          </label>
          <TextField
            {...register("density")}
            error={!!errors.density}
            helperText={errors.density?.message}
            className="formInput"
            fullWidth
            label="Enter Density"
            id="density"
            variant="outlined"
            InputLabelProps={{ shrink: !!density }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Density Unit <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <InputLabel id="density-unit-select-label">
              Select Density Unit
            </InputLabel>
            <Controller
              name="densityUnit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={!!errors.densityUnit}
                  label="Select Density Unit"
                  labelId="density-unit-select-label"
                  InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                  }}
                >
                  {densityUnits?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.densityUnit && (
              <FormHelperText error>
                {errors.densityUnit?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Conductivity <span className="startColor">*</span>
          </label>
          <TextField
            {...register("conductivity")}
            error={!!errors.conductivity}
            helperText={errors.conductivity?.message}
            className="formInput"
            fullWidth
            label="Enter Conductivity"
            variant="outlined"
            InputLabelProps={{ shrink: !!conductivity }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Conductivity Unit <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <InputLabel id="conductivity-unit-select-label">
              Select Conductivity Unit
            </InputLabel>
            <Controller
              name="conductivityUnit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={!!errors.conductivityUnit}
                  label="Select Conductivity Unit"
                  labelId="conductivity-unit-select-label"
                  InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                  }}
                >
                  {conductivityUnits?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.conductivityUnit && (
              <FormHelperText error>
                {errors.conductivityUnit?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Viscosity <span className="startColor">*</span>
          </label>
          <TextField
            {...register("viscosity")}
            error={!!errors.viscosity}
            helperText={errors.viscosity?.message}
            className="formInput"
            fullWidth
            label="Enter Viscosity"
            variant="outlined"
            InputLabelProps={{ shrink: !!viscosity }}
            InputProps={{
              endAdornment: loading && <CircularProgress size={20} />,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <label className="formLabel">
            Select Viscosity Unit <span className="startColor">*</span>
          </label>
          <FormControl fullWidth className="formInput">
            <InputLabel id="viscosity-unit-select-label">
              Select Viscosity Unit
            </InputLabel>
            <Controller
              name="viscosityUnit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  error={!!errors.viscosityUnit}
                  label="Select Viscosity Unit"
                  labelId="viscosity-unit-select-label"
                  InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                  }}
                >
                  {viscosityUnits?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.viscosityUnit && (
              <FormHelperText error>
                {errors.viscosityUnit?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default ChemicalForm;
