import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../../../styles/global.css";
import {
  templateConfigAddSchema,
  templateConfigSchema,
} from "../../../validators/templateConfigValidation";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { fetchChemicalsUnits } from "../../../redux/Slices/Master/ChemicalUnitsSlice";
import {
  fetchChemicals,
  searchChemicalForTemplate,
} from "../../../redux/Slices/Master/ChemicalSlice";
import {
  getMasterTemplateById,
  updateMasterTemplate,
} from "../../../redux/Slices/Master/MasterTemplateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import headerURL from "../../headerURL";
import GridLayout from "../../../layout/GridLayout";
import SearchableAutocomplete from "../../../components/SearchableAutoComplete";

const EditTemplateConfig = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const { allChemicals, loading: chemicalLoading } = useSelector(
    (state) => state.chemical
  );
  const { ratioUnits } = useSelector((state) => state.chemicalUnits);
  const { masterTemplate, loading } = useSelector(
    (state) => state.masterTemplate
  );

  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editTemplateConfig.text,
        path: headerURL.editTemplateConfig.path,
      })
    );
  }, [dispatch]);

  // Form for updating template name
  const {
    register: registerTemplate,
    handleSubmit: handleSubmitTemplate,
    setValue: setValueTemplate,
  } = useForm({
    defaultValues: {
      templateName: "",
    },
    resolver: yupResolver(templateConfigSchema),
  });

  // Form for adding/editing chemicals
  const {
    register: registerChemical,
    handleSubmit: handleSubmitChemical,
    control,
    formState: { errors },
    setValue: setValueChemical,
    watch,
    reset: resetChemical,
  } = useForm({
    defaultValues: {
      ChemicalName: "",
      RatioName: null,
      RatioUnit: "",
    },
    resolver: yupResolver(templateConfigAddSchema),
  });

  console.log(data, "datatatat");

  // Main form submission handler for chemicals
  const onSubmitChemical = (formData) => {
    console.log(formData, ";;;");

    const isDuplicate = data.some(
      (item, index) =>
        item.ChemicalName === formData.ChemicalName && index !== editIndex
    );

    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Chemical",
        text: "The same chemical name cannot be added more than once.",
      });
      return;
    }

    const chemical = allChemicals.find(
      (chem) => chem._id === formData.ChemicalName
    );
    const newEntry = {
      ...formData,
      ChemicalDisplayName: chemical ? chemical.name : "",
    };

    if (editIndex !== null) {
      const updatedData = data.map((item, index) =>
        index === editIndex ? newEntry : item
      );
      setData(updatedData);
      setEditIndex(null);
    } else {
      setData([...data, newEntry]);
    }

    resetChemical();
    setValueChemical("ChemicalName", null);
  };

  // Template name submission handler
  const onSubmitTemplate = async (dataTemplate) => {
    const chemicals =
      data.length > 0
        ? data.map((item) => ({
            chemicalId: item.ChemicalName,
            ratio: item.RatioName,
            ratioUnit: item.RatioUnit,
          }))
        : [];

    const finalTemplate = {
      name: dataTemplate.templateName,
      chemicals,
    };

    try {
      const response = await dispatch(
        updateMasterTemplate({ id, payload: finalTemplate })
      ).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Template update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewTemplateConfig);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update template",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    dispatch(fetchChemicals({ pageSize: 10, page: 1 }));
    dispatch(fetchChemicalsUnits({ pageSize: 10, page: 1 }));
    dispatch(getMasterTemplateById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (masterTemplate) {
      setValueTemplate("templateName", masterTemplate?.name);

      const formattedData = masterTemplate?.chemicals?.map((chem) => ({
        RatioName: chem.ratio,
        RatioUnit: chem.ratioUnit,
        ChemicalName: chem.chemicalId._id,
        ChemicalDisplayName: chem.chemicalId.name,
      }));
      setData(formattedData);
    }
  }, [masterTemplate, setValueTemplate]);

  const handleEdit = (index) => {
    const item = data[index];

    setValueChemical("RatioName", item?.RatioName);
    setValueChemical("RatioUnit", item?.RatioUnit);
    setValueChemical("ChemicalName", item?.ChemicalName);
    setEditIndex(index);
    console.log(item, "--item--");
  };

  // Delete handler
  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  console.log(errors, "yup errors");
  return (
    <section
      className={`sky-bg ${
        data?.length > 4 ? "h-auto" : "vh-100"
      }  ${sectionClass}`}
    >
      <Box padding={5}>
        {/* Template Name Form */}
        <form onSubmit={handleSubmitTemplate(onSubmitTemplate)}>
          <GridLayout>
            <Grid item xs={6} md={6} sm={6}>
              <label className="formLabel mb-3">
                Template Name <span className="startColor">*</span>
              </label>
              <TextField
                label="Template Name"
                variant="outlined"
                fullWidth
                {...registerTemplate("templateName")}
                error={!!errors.templateName}
                helperText={errors.templateName?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button variant="contained" color="primary" type="submit">
                Update Template
              </Button>
              <Button
                variant="grey"
                onClick={() => navigate(URL.viewTemplateConfig)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Grid>
          </GridLayout>
        </form>

        {/* Main Form for Chemicals */}
        <form onSubmit={handleSubmitChemical(onSubmitChemical)}>
          <GridLayout className={`mt-5`}>
            <Grid item xs={4} md={4} sm={12}>
              <label className="formLabel mb-3">
                Chemical Name <span className="startColor">*</span>
              </label>
              <FormControl fullWidth>
                <Controller
                  name="ChemicalName"
                  control={control}
                  render={({ field }) => (
                    <SearchableAutocomplete
                      {...field}
                      control={control}
                      fieldName="ChemicalName"
                      dispatch={dispatch}
                      searchAction={searchChemicalForTemplate}
                      options={allChemicals}
                      valueResolver={() =>
                        // Logic to resolve the initial value
                        allChemicals?.find((ch) => ch._id === watch("ChemicalName")) ||
                        (watch("ChemicalName")
                          ? {
                              _id: watch("ChemicalName"),
                              name: data[editIndex]?.ChemicalDisplayName || "Original Service",
                            }
                          : null)
                      }
                      setValue={setValueChemical}
                      errors={errors}
                      label="Select Chemical Name"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} md={4} sm={12}>
              <label className="formLabel mb-3">
                Ratio <span className="startColor">*</span>
              </label>
              <FormControl fullWidth>
                <TextField
                  {...registerChemical("RatioName")}
                  error={!!errors.RatioName}
                  helperText={errors.RatioName?.message}
                  label="Ratio"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} md={4} sm={12}>
              <label className="formLabel mb-3">
                Ratio Unit <span className="startColor">*</span>
              </label>
              <FormControl fullWidth>
                <InputLabel id="ratio-unit-label">Select Ratio Unit</InputLabel>
                <Controller
                  name="RatioUnit"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Select Ratio Unit"
                      labelId="ratio-unit-label"
                      id="ratio-unit-select"
                    >
                      {ratioUnits?.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.RatioUnit && (
                  <FormHelperText>{errors.RatioUnit?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <Button variant="contained" color="primary" type="submit">
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </Grid>
          </GridLayout>
        </form>

        {/* Data Table */}

        {/* Data Table */}
        <GridLayout>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>Chemical Name</TableCell>
                  <TableCell>Ratio</TableCell>
                  <TableCell>Ratio Unit</TableCell>
                  <TableCell className="MuiDataGrid-columnHeaderTitle">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : data?.length > 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.ChemicalDisplayName}</TableCell>
                      <TableCell>{item.RatioName}</TableCell>
                      <TableCell>{item.RatioUnit}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEdit(index)}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: "10px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(index)}
                          variant="grey"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GridLayout>
      </Box>
    </section>
  );
};

export default EditTemplateConfig;
