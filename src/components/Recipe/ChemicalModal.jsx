import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Modal,
  MenuItem,
} from "@mui/material";
import SearchableAutocomplete from "../SearchableAutoComplete";
import { searchChemicalForRecipe } from "../../redux/Slices/Master/ChemicalSlice";
import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";

const ChemicalModal = ({
  open,
  onClose,
  onSubmit,
  chemicalForm, 
  allChemicals,
  ratioUnits,
  mode,
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const { control, setValue, formState: { errors }, watch  } = chemicalForm;

    


  // Watched values for easier access
  const watchedChemicalId = watch('chemicalId');
  const watchedChemicalName = watch('name'); // Assume `chemicalName` is part of the form.

  const valueResolver = () => {
    if (mode === "edit" && watchedChemicalId && watchedChemicalName) {
      // For edit mode, use pre-filled form values
      return {
        _id: watchedChemicalId,
        name: watchedChemicalName,
      };
    } else if (mode === "add" && watchedChemicalId) {
      // For add mode, find the chemical in allChemicals by ID
      const chemical = allChemicals.find(c => c._id === watchedChemicalId);
      return chemical ? { _id: chemical._id, name: chemical.name } : null;
    }
    return null;
  };

  const handleChemicalChange = (event, selectedOption) => {
    if (selectedOption) {
      // Set both chemicalId and chemicalName
      setValue("chemicalId", selectedOption._id || "", { shouldValidate: true });
      setValue("name", selectedOption.name || "", { shouldValidate: true });
    } else {
      // Reset both values if nothing is selected
      setValue("chemicalId", "", { shouldValidate: true });
      setValue("name", "", { shouldValidate: true });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {mode === "add" ? "Add Chemical" : "Edit Chemical"}
        </Typography>
        <form onSubmit={chemicalForm.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.chemicalId}>
                <Controller
                  name="chemicalId"
                  control={control}
                  render={({ field }) => (
                    <SearchableAutocomplete
                      {...field}
                      fieldName="chemicalId"
                      dispatch={dispatch}
                      searchAction={searchChemicalForRecipe}
                      options={allChemicals}
                      valueResolver={valueResolver}
                      setValue={setValue}
                      errors={errors}
                      label="Chemical"
                      disabled={disabled}
                      customOnChange={handleChemicalChange}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="ratio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ratio"
                    type="number"
                    fullWidth
                    error={!!errors.ratio}
                    helperText={errors.ratio?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="ratioUnit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.ratioUnit}>
                    <TextField
                      {...field}
                      select
                      label="Ratio Unit"
                      fullWidth
                      error={!!errors.ratioUnit}
                      helperText={errors.ratioUnit?.message}
                    >
                      {ratioUnits?.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {mode === "add" ? "Add" : "Save Changes"}
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ChemicalModal;