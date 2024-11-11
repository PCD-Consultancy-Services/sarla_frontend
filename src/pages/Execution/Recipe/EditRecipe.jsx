import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchShade } from "../../../redux/Slices/Execution/ShadeSlice";
import { searchQuality } from "../../../redux/Slices/Master/QualitySlice";
import { searchCustomer } from "../../../redux/Slices/Master/CustomerSlice";
import { fetchRecipesUnits } from "../../../redux/Slices/Execution/RecipeUnitsSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditRecipeValidationSchema } from "../../../validators/recipeValidation";
import { USER } from "../../../constants/roles";
import {
  addChildChemicalWhileUpdate,
  addParentChemicalWhileUpdate,
  deleteChildChemicalWhileUpdate,
  deleteParentChemicalWhileUpdate,
  fetchTemplates,
  getReceipe,
  updateChildChemicalWhileUpdate,
  updateParentChemicalWhileUpdate,
  updateReceipe,
} from "../../../redux/Slices/Execution/RecipeSlice";
import { fetchChemicals } from "../../../redux/Slices/Master/ChemicalSlice";
import { fetchChemicalsUnits } from "../../../redux/Slices/Master/ChemicalUnitsSlice";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { fetchTemplateById } from "../../../redux/Slices/Execution/ChemicalManagement";
import Listbox from "../../../components/InfiniteScroll";
import RecipeTable from "../../../components/Recipe/RecipeTable";

const EditRecipe = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { recipeTypes } = useSelector((state) => state.recipeUnits);

  const { user } = useSelector((state) => state.auth);
  const { templates, receipe, loading } = useSelector((state) => state.recipe);
  const { ratioUnits } = useSelector((state) => state.chemicalUnits);

  const { allChemicals } = useSelector((state) => state.chemical);
  const [isEditingChild, setisEditingChild] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState();

  const [chemicalForm, setchemicalForm] = useState({
    chemicalId: "",
    ratio: "",
    ratioUnit: "",
  });

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editRecipe.text,
        path: headerURL.editRecipe.path,
      })
    );

    dispatch(fetchRecipesUnits());
    dispatch(fetchTemplates());
    dispatch(fetchChemicals({}));
    dispatch(fetchChemicalsUnits({ }));
    // dispatch(fetchChemicals({ pageSize: 10, page: 1 }));
    // dispatch(fetchChemicalsUnits({ pageSize: 10, page: 1 }));
    dispatch(getReceipe(id));
  }, [dispatch]);

  const handleChemicalFormChange = (e) => {
    setchemicalForm({
      ...chemicalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChild = (parent) => {
    setSelectedParent(parent);
    setModelOpen(true);
  };

  const handleAddChildSubmit = async (e) => {
    e.preventDefault();
    setModelOpen(false);

    const payload = {
      id,
      parent_id: selectedParent?.templateId._id,
      payload: {
        chemicalId: chemicalForm?.chemicalId,
        ratio: chemicalForm?.ratio,
        ratioUnit: chemicalForm?.ratioUnit,
      },
    };

    const response = await dispatch(addChildChemicalWhileUpdate(payload));
    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to add parent chemical",
      });
    } else {
      await dispatch(getReceipe(id));
      Swal.fire({
        icon: "success",
        text:
          response?.payload?.message || "Parent Chemical added successfully",
      });
    }

    setchemicalForm({ chemicalId: "", ratio: "", ratioUnit: "" });
  };

  const [modelOpen, setModelOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChemicalForm, setEditingChemicalForm] = useState({
    chemicalId: "",
    ratio: "",
    ratioUnit: "",
  });

  const handleEditChemicalFormChange = (e) => {
    const { name, value } = e.target;
    setEditingChemicalForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditChildChemical = (parent, child) => {
    setSelectedParent(parent);
    setEditingChemicalForm({
      chemicalId: child?.chemicalId?._id,
      ratio: child?.ratio,
      ratioUnit: child?.ratioUnit,
    });
    setIsEditModalOpen(true);
    setisEditingChild(true);
  };

  const handleUpdateChildChemical = async (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    // console.log(selectedParent);
    const payload = {
      id,
      parent_id: selectedParent?.templateId?._id,
      child_id: editingChemicalForm.chemicalId,
      payload: {
        ratio: editingChemicalForm.ratio,
        ratioUnit: editingChemicalForm.ratioUnit,
      },
    };
    const response = await dispatch(updateChildChemicalWhileUpdate(payload));

    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to update child chemical",
      });
    } else {
      await dispatch(getReceipe(id));
      Swal.fire({
        icon: "success",
        text:
          response?.payload?.message || "Child chemical updated successfully",
      });
    }
  };

  const handleUpdateParentChemical = async (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);

    const payload = {
      id,
      parent_id: editingChemicalForm.chemicalId,
      payload: {
        ratio: editingChemicalForm.ratio,
        ratioUnit: editingChemicalForm.ratioUnit,
      },
    };
    const response = await dispatch(updateParentChemicalWhileUpdate(payload));

    await dispatch(getReceipe(id));
    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to update parent chemical",
      });
    } else {
      Swal.fire({
        icon: "success",
        text:
          response?.payload?.message || "Parent chemical updated successfully",
      });
    }
  };

  const handleDeleteParentChemical = async (parent) => {
  
    const payload = {
      id,
      parent_id: parent.templateId._id,
    };

    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      const response = await dispatch(deleteParentChemicalWhileUpdate(payload));
      await dispatch(getReceipe(id));

      if (response.error) {
        Swal.fire({
          icon: "error",
          text:
            response?.payload?.message || "Failed to delete parent chemical",
        });
      } else {
        Swal.fire({
          icon: "success",
          text:
            response?.payload?.message ||
            "Parent chemical deleted successfully",
        });
      }
    }
  };

  const handleDeleteChildChemical = async (parent, child) => {
    // console.log(parent);
    const payload = {
      id,
      parent_id: parent.templateId._id,
      child_id: child.chemicalId._id,
    };

    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      const response = await dispatch(deleteChildChemicalWhileUpdate(payload));

      if (response.error) {
        Swal.fire({
          icon: "error",
          text: response?.payload?.message || "Failed to delete child chemical",
        });
      } else {
        await dispatch(getReceipe(id));
        Swal.fire({
          icon: "success",
          text:
            response?.payload?.message || "Child chemical deleted successfully",
        });
      }
    }
  };

  // Shade ---------------------------------------------------------------
  const [searchQueries, setSearchQueries] = useState({
    shade: "",
    quality: "",
    customer: "",
  });
  const [selectedIds, setSelectedIds] = useState({
    shade: null,
    quality: null,
    customer: null,
  });
  const [pageSizes, setPageSizes] = useState({
    shade: 5,
    quality: 5,
    customer: 5,
  });

  const debouncedSearchQueries = {
    shade: useDebounce(searchQueries.shade, 300),
    quality: useDebounce(searchQueries.quality, 300),
    customer: useDebounce(searchQueries.customer, 300),
  };

  // Fetch shades , Qualities & customer -------------------------------------------------------------
  const { allShade, loading: shadeLoading } = useSelector(
    (state) => state.shade
  );

  const { allQualities, loading: qualityLoading } = useSelector(
    (state) => state.quality
  );

  const { allCustomers, loading: customerLoading } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    if (!receipe) return;

    const fetchData = async (apiCall, key) => {
      const response = await apiCall();
      if (response.payload.data.results.length > 0) {
        const result = response.payload.data.results[0];
        setSelectedIds((prev) => ({
          ...prev,
          [key]: result,
        }));
        setValue(key + "Id", result._id, { shouldValidate: true });
      }
    };

    receipe.shadeId &&
      fetchData(
        () => dispatch(searchShade({ shadeCode: receipe.shadeId.shadeCode })),
        "shade"
      );
    receipe.qualityId &&
      fetchData(
        () =>
          dispatch(
            searchQuality({ qualityCode: receipe.qualityId.qualityCode })
          ),
        "quality"
      );
    receipe.customerId &&
      fetchData(
        () => dispatch(searchCustomer({ name: receipe.customerId.name })),
        "customer"
      );
  }, [receipe, dispatch]);

  const fetchSearchResults = (searchKey, query, searchFunction, pageSize) => {
    if (query.length > 0) {
      dispatch(searchFunction({ [searchKey]: query, pageSize }));
    } else if(!selectedIds.shade || !selectedIds.quality || !selectedIds.customer) {
      dispatch(searchFunction({ pageSize }));
    }
  };

  useEffect(() => {
    fetchSearchResults(
      "shadeCode",
      debouncedSearchQueries.shade,
      searchShade,
      pageSizes.shade
    );
  }, [debouncedSearchQueries.shade, dispatch, pageSizes.shade]);

  useEffect(() => {
    fetchSearchResults(
      "qualityCode",
      debouncedSearchQueries.quality,
      searchQuality,
      pageSizes.quality
    );
  }, [debouncedSearchQueries.quality, dispatch, pageSizes.quality]);

  useEffect(() => {
    fetchSearchResults(
      "name",
      debouncedSearchQueries.customer,
      searchCustomer,
      pageSizes.customer
    );
  }, [debouncedSearchQueries.customer, dispatch, pageSizes.customer]);

  // ----------------------------------------------------------------------------------

  // Common function for handling scroll and loading more items
  const handleListEnd = (searchType) => {
    setPageSizes((prevSizes) => ({
      ...prevSizes,
      [searchType]: prevSizes[searchType] + 5,
    }));
  };

  const handleInputChange = (type) => (event, newInputValue) => {
    // Only update the searchQueries if the input value is being typed (not when an option is selected)
    if (event?.type === "change") {
      setSearchQueries((prev) => ({ ...prev, [type]: newInputValue }));
    }

    // Mapping of search types to their respective actions
    const searchActions = {
      shade: () => dispatch(searchShade({ pageSize: pageSizes.shade })),
      quality: () => dispatch(searchQuality({ pageSize: pageSizes.quality })),
      customer: () =>
        dispatch(searchCustomer({ pageSize: pageSizes.customer })),
    };

    // Call the corresponding action when input is cleared (empty string)
    if (newInputValue === "" && searchActions[type]) {
      setSearchQueries((prev) => ({ ...prev, [type]: "" }));
      searchActions[type](); // Trigger default list API
    }
  };

  // Common function for handling selection change
  const handleSelectionChange = (type) => (event, newValue) => {
    setSelectedIds((prev) => ({ ...prev, [type]: newValue }));
    if (newValue) {
      setValue(type + "Id", newValue._id, { shouldValidate: true });
    } else {
      setValue(type + "Id", "", { shouldValidate: true });
    }
  };

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shadeId: "",
      qualityId: "",
      customerId: "",
      recipeType: "",
    },
    resolver: yupResolver(EditRecipeValidationSchema),
  });

  // getting values -----------------------------------------------------
  useEffect(() => {
    if (receipe) {
      reset({
        recipeType: receipe.recipeType || "",
      });
    }
  }, [receipe, reset]);


  const handleTemplateChange = async (selectedTemplate) => {
    const response = await dispatch(fetchTemplateById(selectedTemplate));
    if (response?.payload.data) {
      const templateData = response?.payload.data;
      setSelectedTemplate(templateData);
    } else if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to select Template",
      });
    }
  };

  const handleAddStep = async () => {
    const payload = {
      id,
      payload: {
        templateId: selectedTemplate?._id,
        childChemicals: selectedTemplate?.chemicals.map((chemical) => ({
          chemicalId: chemical?.chemicalId?._id,
          ratio: chemical?.ratio,
          ratioUnit: chemical?.ratioUnit,
        })),
      },
    };

    const response = await dispatch(addParentChemicalWhileUpdate(payload));
    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to add parent chemical",
      });
    } else {
      await dispatch(getReceipe(id));
      Swal.fire({
        icon: "success",
        text:
          response?.payload?.message || "Parent Chemical added successfully",
      });
    }
  };
  // getting values end -------------------------------------------------

  const toggleModal = () => setModelOpen(!modelOpen);

  const onSubmit = async (data) => {
    // console.log(data)
    const payload = {
      id,
      payload: {
        ...data,
      },
    };
    const response = await dispatch(updateReceipe(payload));
    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to add receipe",
      });
    } else {
      Swal.fire({
        icon: "success",
        text: response?.payload?.message || "Receipe updated successfully",
      });
    }
  };

  return (
    <section className={`sky-bg h-auto pb-3 ${sectionClass}`}>
      <Box paddingTop={5}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid
            container
            spacing={2}
            bgcolor={"white"}
            borderRadius={"15px"}
            padding={"20px"}
          >
            <Grid item xs={6}>
              <label className="formLabel mb-2">
                Shade <span className="startColor">*</span>
              </label>
              <Controller
                name="shadeId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={allShade}
                    getOptionLabel={(option) =>
                      `${option.shadeCode} - ${option.color}` || ""
                    }
                    onInputChange={handleInputChange("shade")}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                    value={selectedIds.shade}
                    noOptionsText="Type Something to view the results"
                    onChange={handleSelectionChange("shade")}
                    ListboxComponent={(props) => (
                      <Listbox
                        {...props}
                        onListEnd={() => handleListEnd("shade")}
                      />
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Shade"
                        variant="outlined"
                        fullWidth
                        error={!!errors.shadeId}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {shadeLoading && <CircularProgress size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {errors.shadeId && (
                <FormHelperText error>{errors.shadeId.message}</FormHelperText>
              )}
              <div className="d-flex justify-content-end w-100 mt-3">
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(URL.addShade, { state: { from: URL.addRecipe } })
                  }
                >
                  ADD SHADE
                </Button>
              </div>
            </Grid>

            <Grid item xs={6}>
              <label className="formLabel mb-2">
                Quality Code <span className="startColor">*</span>
              </label>
              <Controller
                name="qualityId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={allQualities}
                    getOptionLabel={(option) =>
                      `${option.qualityCode} - ${option.qualityCodeManual}` ||
                      ""
                    }
                    onInputChange={handleInputChange("quality")}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                    value={selectedIds.quality}
                    onChange={handleSelectionChange("quality")}
                    ListboxComponent={(props) => (
                      <Listbox
                        {...props}
                        onListEnd={() => handleListEnd("quality")}
                      />
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Quality Code"
                        variant="outlined"
                        fullWidth
                        error={!!errors.qualityId}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {qualityLoading && <CircularProgress size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {errors.qualityId && (
                <FormHelperText error>
                  {errors.qualityId.message}
                </FormHelperText>
              )}
              <div className="d-flex justify-content-end w-100 mt-3">
                <Button
                  disabled={user.role.key === USER}
                  variant="contained"
                  onClick={() => navigate(URL.addQuality)}
                >
                  Add New Quality
                </Button>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            bgcolor={"white"}
            borderRadius={"15px"}
            padding={"20px"}
          >
            <Grid item xs={6}>
              <label className="formLabel mb-2">
                Customer <span className="startColor">*</span>
              </label>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={allCustomers}
                    getOptionLabel={(option) =>
                      `${option.name} - ${option.custCode}` || ""
                    }
                    onInputChange={handleInputChange("customer")}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                    value={selectedIds.customer}
                    onChange={handleSelectionChange("customer")}
                    loading={customerLoading}
                    ListboxComponent={(props) => (
                      <Listbox
                        {...props}
                        onListEnd={() => handleListEnd("customer")}
                      />
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer"
                        variant="outlined"
                        fullWidth
                        error={!!errors.customerId}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {customerLoading ? (
                                <CircularProgress size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {errors.customerId && (
                <FormHelperText error>
                  {errors.customerId.message}
                </FormHelperText>
              )}
              <div className="d-flex justify-content-end w-100 mt-3">
                <Button
                  disabled={user.role.key === USER}
                  variant="contained"
                  onClick={() => navigate(URL.addCustomer)}
                >
                  Add New Customer
                </Button>
              </div>
            </Grid>

            <Grid item xs={6}>
              <label className="formLabel mb-2">
                Recipe Type <span className="startColor">*</span>
              </label>
              <Controller
                name="recipeType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="recipeTypeLabel">
                      Select Recipe Type
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="recipeTypeLabel"
                      label="Select Recipe Type"
                      error={!!errors.recipeType}
                    >
                      {recipeTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.recipeType && (
                      <FormHelperText error>
                        {errors.recipeType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                className="w100 float-end"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} /> : "Save All"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* ----------------------------------------------------------------------------------------- */}

        <Grid
          container
          spacing={2}
          bgcolor={"white"}
          borderRadius={"15px"}
          padding={"20px"}
          item
          xs={12}
        >
          <Grid item xs={4}>
            <label className="formLabel pb-4">Select Master Template</label>
            <FormControl fullWidth error={!!errors.templateId}>
              <InputLabel id="select-template-label">
                Select Template
              </InputLabel>
              <Controller
                name="templateId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="select-template-label"
                    id="select-template"
                    label="Select Template"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleTemplateChange(e.target.value);
                    }}
                  >
                    {templates.map((template) => (
                      <MenuItem key={template._id} value={template._id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.templateId && (
                <FormHelperText error>
                  {errors.templateId.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              onClick={handleAddStep}
              className="my-2"
              variant="contained"
              disabled={!selectedTemplate}
            >
              Add Master Template
            </Button>
          </Grid>
          <RecipeTable
            parentChemicals={receipe?.parentChemicals}
            handleAddChild={handleAddChild}
            handleEditChildChemical={handleEditChildChemical}
            handleDeleteChildChemical={handleDeleteChildChemical}
            handleDeleteParentChemical={handleDeleteParentChemical}
            mode="edit"
          />
        </Grid>
      </Box>
      {/* add child modal Start */}
      <Modal open={modelOpen} onClose={toggleModal}>
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
          <form onSubmit={handleAddChildSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="chemical-name-label">Chemical</InputLabel>
                  <Select
                    name="chemicalId"
                    value={chemicalForm?.chemicalId}
                    onChange={handleChemicalFormChange}
                    label="Chemical"
                    labelId="chemical-name-label"
                  >
                    {allChemicals?.map((ele) => (
                      <MenuItem key={ele._id} value={ele._id}>
                        {ele?.name} - {ele?.materialCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="ratio"
                  label="Ratio"
                  type="number"
                  value={chemicalForm.ratio}
                  onChange={handleChemicalFormChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="ratio-unit-label">Ratio Unit</InputLabel>
                  <Select
                    name="ratioUnit"
                    value={chemicalForm.ratioUnit}
                    onChange={handleChemicalFormChange}
                    label="Ratio Unit"
                    labelId="ratio-unit-label"
                  >
                    {ratioUnits?.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Add
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setModelOpen(false)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {/* add child modal close */}

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="edit-parent-chemical-modal"
      >
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
          <Typography variant="h6" component="h2">
            {isEditingChild ? "Edit Child Chemical" : "Edit Parent Chemical"}
          </Typography>
          <form
            onSubmit={
              isEditingChild
                ? handleUpdateChildChemical
                : handleUpdateParentChemical
            }
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="chemical-name-label">Chemical </InputLabel>
              <Select
                name="chemicalId"
                value={editingChemicalForm.chemicalId}
                label="Chemical"
                labelId="chemical-name-label"
                onChange={handleEditChemicalFormChange}
                disabled
              >
                {allChemicals.map((chemical) => (
                  <MenuItem key={chemical._id} value={chemical._id}>
                    {chemical.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Ratio"
              name="ratio"
              value={editingChemicalForm.ratio}
              onChange={handleEditChemicalFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="ratio-unit-label">Ratio Unit</InputLabel>
              <Select
                name="ratioUnit"
                value={editingChemicalForm.ratioUnit}
                label="Ratio Unit"
                labelId="ratio-unit-label"
                onChange={handleEditChemicalFormChange}
              >
                {ratioUnits?.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
    </section>
  );
};

export default EditRecipe;
