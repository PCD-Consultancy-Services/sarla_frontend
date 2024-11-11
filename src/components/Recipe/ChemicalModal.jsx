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
import Autocomplete from "@mui/material/Autocomplete";

const ChemicalModal = ({
  open,
  onClose,
  onSubmit,
  chemicalForm,
  handleChemicalFormChange,
  allChemicals,
  ratioUnits,
  mode,
}) => {
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
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  options={allChemicals}
                  getOptionLabel={(option) =>
                    `${option.name} - ${option.materialCode}`
                  }
                  onChange={(event, newValue) => {
                    handleChemicalFormChange({
                      chemicalId: newValue ? newValue._id : "",
                      name: newValue ? newValue.name : "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chemical"
                      variant="outlined"
                    />
                  )}
                  value={
                    allChemicals.find(
                      (chemical) => chemical._id === chemicalForm.chemicalId
                    ) || null
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="ratio"
                label="Ratio"
                type="number"
                value={chemicalForm.ratio}
                onChange={(e) => handleChemicalFormChange({ ratio: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  select
                  name="ratioUnit"
                  label="Ratio Unit"
                  value={chemicalForm.ratioUnit}
                  onChange={(e) => handleChemicalFormChange({ ratioUnit: e.target.value })}
                  fullWidth
                >
                  {ratioUnits?.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
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