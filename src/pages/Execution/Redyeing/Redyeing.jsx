import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function Redyeing() {
  const initialRows = [
    {
      id: "1",
      step: "UNI",
      chemicalName: "Maintain pH",
      tank: "",
      ratio: "",
      ratioUnit: "",
      quantity: "",
      status: "",
      mode: "",
      actualWeights: "",
      setWeight: "",
      command: "",
      reDispense: "",
    },
    {
      id: "1.2",
      step: "UNI",
      chemicalName: "Darlene Robertson",
      tank: "Task 3",
      ratio: "a",
      ratioUnit: "ST 3",
      quantity: "Action 1",
      status: "OID1",
      mode: "5/27/15",
      actualWeights: "PID1",
      setWeight: "PID1",
      command: "Action 1",
      reDispense: "Action 2",
    },
    {
      id: "1.3",
      step: "UNI",
      chemicalName: "Arlene McCoy",
      tank: "Task 4",
      ratio: "a",
      ratioUnit: "ST 4",
      quantity: "Action 1",
      status: "OID1",
      mode: "5/30/14",
      actualWeights: "PID1",
      setWeight: "PID1",
      command: "Action 1",
      reDispense: "Action 2",
    },
    {
      id: "1.4",
      step: "UNI",
      chemicalName: "Dianne Russell",
      tank: "Task 5",
      ratio: "a",
      ratioUnit: "ST 5",
      quantity: "Action 1",
      status: "OID1",
      mode: "1/15/12",
      actualWeights: "PID1",
      setWeight: "PID1",
      command: "Action 1",
      reDispense: "Action 2",
    },
  ];

  const columns = [
    { field: "id", headerName: "Sr No.", minWidth: 120, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "step", headerName: "Step", minWidth: 120, flex: 0.5, headerAlign: "center", align: "center" },
    {
      field: "chemicalName",
      headerName: "Chemical Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value === "Maintain pH" ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleMaintainPHClick(params.id)}
          >
            Maintain pH
          </Button>
        ) : (
          params.value
        ),
    },
    { field: "tank", headerName: "Tank", minWidth: 120, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "ratio", headerName: "Ratio", editable: true, minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "ratioUnit", headerName: "Ratio Unit", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "quantity", headerName: "Quantity", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "mode", headerName: "Mode", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "actualWeights", headerName: "Actual Weights", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    { field: "setWeight", headerName: "Set Weight", minWidth: 150, flex: 0.5, headerAlign: "center", align: "center" },
    {
      field: "command",
      headerName: "Command",
      minWidth: 150,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleCommandClick(params.id)}>
          Dispense
        </Button>
      ),
    },
    {
      field: "reDispense",
      headerName: "Re-dispense",
      minWidth: 150,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleReDispenseClick(params.id)}>
           Re-Dispense
        </Button>
      ),
    },
  ];

  const [rows, setRows] = useState(initialRows);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    chemicalName: "",
    tank: "",
    ratio: "",
    ratioUnit: "",
    quantity: "",
  });
  const [newRowId, setNewRowId] = useState(null);

  const dispatch = useDispatch();
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.redyeing.text,
        path: headerURL.redyeing.path,
      })
    );
  }, [dispatch]);

  const handleFieldChange = (params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    );
    setRows(updatedRows);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    const newRow = {
      id: (rows.length + 1).toString(),
      step: "UNI",
      chemicalName: formData.chemicalName,
      tank: formData.tank,
      ratio: formData.ratio,
      ratioUnit: formData.ratioUnit,
      quantity: formData.quantity,
      status: "",
      mode: "",
      actualWeights: "",
      setWeight: "",
      command: "New Command",
      reDispense: "New Re-dispense",
    };
    const updatedRows = [...rows];
    updatedRows.splice(newRowId + 1, 0, newRow);
    setRows(updatedRows);
    setFormVisible(false);
    setFormData({
      chemicalName: "",
      tank: "",
      ratio: "",
      ratioUnit: "",
      quantity: "",
    });
    setNewRowId(null);
  };

  const handleMaintainPHClick = (id) => {
    setNewRowId(id);
    setFormVisible(true);
  };

  const handleCommandClick = (id) => {
    console.log("Command button clicked for row ID:", id);
    // Add your logic here for handling command button click
  };

  const handleReDispenseClick = (id) => {
    console.log("Re-dispense button clicked for row ID:", id);
    // Add your logic here for handling re-dispense button click
  };

  const handleCloseModal = () => {
    setFormVisible(false);
    setFormData({
      chemicalName: "",
      tank: "",
      ratio: "",
      ratioUnit: "",
      quantity: "",
    });
  };

  return (
    <section className={`sky-bg h-auto pb-5 addCustomerSection ${sectionClass}`}>
      <Box paddingTop={5}>
        <Grid container spacing={2} bgcolor="white" borderRadius="15px" padding="20px">
          <Grid item xs={12} className="d-flex align-items-center">
            <label className="formLabel">Slip Number :</label>
            <div className="search-inp ms-5">
              <SearchIcon className="search-Icon" />
              <input
                type="text"
                placeholder="Search"
                className="border-0 bg-transparent p-2 no-outline"
              />
            </div>
            <Button variant="contained" className="ms-5 w150">
              Export To PDF
            </Button>
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Machine :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Customer Name"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Customer :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Customer Name"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Shade No. :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Shade No."
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Card Batch :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Card Batch"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Quality :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Quality"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">RM Lot No. :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="RM Lot No."
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center">
            <label className="formLabel w100">Customer :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Customer Name"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center gap-sm-4">
            <label className="formLabel">Batch Weight :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Batch Weight"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center gap-sm-4">
            <label className="formLabel">Cones :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Cones"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center gap-sm-4">
            <label className="formLabel">Program No. :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Program No."
              id="fullWidth"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} className="d-flex align-items-center gap-sm-4">
            <label className="formLabel">Recipe Type :</label>
            <TextField
              className="formInput w-50"
              fullWidth
              label="Recipe Type"
              id="fullWidth"
              variant="outlined"
            />
          </Grid>

          <div className="w-100 mt-5 pb-5">
            <DataGrid
              className="border-0 bg-transparent"
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
             
            />
          </div>
        </Grid>
      </Box>

      <Modal
        open={isFormVisible}
        onClose={handleCloseModal}
        aria-labelledby="maintain-ph-modal"
        aria-describedby="maintain-ph-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <h2 id="maintain-ph-modal">Maintain pH Details</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chemical Name"
                variant="outlined"
                name="chemicalName"
                value={formData.chemicalName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tank"
                variant="outlined"
                name="tank"
                value={formData.tank}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ratio"
                variant="outlined"
                name="ratio"
                value={formData.ratio}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ratio Unit"
                variant="outlined"
                name="ratioUnit"
                value={formData.ratioUnit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                variant="outlined"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} className="mt-3">
              <Button variant="contained" color="primary" onClick={handleAddClick}>
                Add
              </Button>
              <Button variant="outlined" color="primary" className="ms-2" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </section>
  );
}

