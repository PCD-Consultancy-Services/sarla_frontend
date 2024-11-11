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
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  searchShade,
} from "../../../redux/Slices/Execution/ShadeSlice";
import {
  searchQuality,
} from "../../../redux/Slices/Master/QualitySlice";
import {
  searchCustomer,
} from "../../../redux/Slices/Master/CustomerSlice";
import { fetchRecipesUnits } from "../../../redux/Slices/Execution/RecipeUnitsSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddRecipeValidationSchema } from "../../../validators/recipeValidation";
import { USER } from "../../../constants/roles";
import {
  createReceipe,
  fetchTemplates,
} from "../../../redux/Slices/Execution/RecipeSlice";
import { fetchChemicals } from "../../../redux/Slices/Master/ChemicalSlice";
import {
  addChildChemical,
  addSubChildChemical,
  clearChemicalData,
  deleteChildChemical,
  deleteParentChemical,
  fetchTemplateById,
  updateChildChemical,
} from "../../../redux/Slices/Execution/ChemicalManagement";
import Swal from "sweetalert2";
import ChemicalModal from "../../../components/Recipe/ChemicalModal";
import Listbox from "../../../components/InfiniteScroll";
import RecipeTable from "../../../components/Recipe/RecipeTable";
import { fetchChemicalsUnits } from "../../../redux/Slices/Master/ChemicalUnitsSlice";

const AddRecipe = () => {
  // -------------------------------------------------------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  // 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const { loading } = useSelector((state) => state.shade);
  const { recipeTypes } = useSelector((state) => state.recipeUnits);

  const { user } = useSelector((state) => state.auth);
  const { templates, loading: recipeLoading } = useSelector(
    (state) => state.recipe
  );
  const { ratioUnits } = useSelector((state) => state.chemicalUnits);

  const { allChemicals } = useSelector((state) => state.chemical);

  const { parentChemicals } = useSelector((state) => state.manageChemicals);

  const [isAddMasterTemplateClicked, setisAddMasterTemplateClicked] =
    useState();

  const [chemicalForm, setchemicalForm] = useState({
    chemicalId: "",
    name :"",
    ratio: "",
    ratioUnit: "",
  });

  const handleChemicalFormChange = (changes) => {
    setchemicalForm(prevForm => ({
      ...prevForm,
      ...changes
    }));
  };

  const handle_Add_OR_EDIT_Child_Submit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      if (editingIndex.childIndex !== null) {
        dispatch(
          addSubChildChemical({
            parentIndex: editingIndex.parentIndex,
            childIndex: editingIndex.childIndex,
            subChildChemical: chemicalForm,
          })
        );
      } else {
        dispatch(
          addChildChemical({
            parentIndex: editingIndex.parentIndex,
            childChemical: chemicalForm,
          })
        );
      }
    } else if (modalMode === "edit") {
      dispatch(
        updateChildChemical({
          parentIndex: editingIndex.parentIndex,
          childIndex: editingIndex.childIndex,
          updatedChild: chemicalForm,
        })
      );
    }
    handleCloseModal();
  };

  const [editingIndex, setEditingIndex] = useState({
    parentIndex: null,
    childIndex: null,
  });

  const handleOpenModal = (mode, parentIndex = null, childIndex = null) => {
    setModalMode(mode);
    if (mode === "edit") {
      const childChemical = parentChemicals[parentIndex].childChemicals[childIndex];
      setchemicalForm({
        chemicalId: childChemical.chemicalId,
        ratio: childChemical.ratio,
        ratioUnit: childChemical.ratioUnit,
      });
    }
    setEditingIndex({ parentIndex, childIndex });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setchemicalForm({ chemicalId: "", ratio: "", ratioUnit: "" });
  };

  const handleDeleteParentChemical = (index) => {
    dispatch(deleteParentChemical(index));
  };

  const handleDeleteChildChemical = (parentIndex, childIndex) => {
    dispatch(deleteChildChemical({ parentIndex, childIndex }));
  };

  // State for search queries and selected values---------------------
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

  // Fetch shades
  const { allShade, loading: shadeLoading } = useSelector(
    (state) => state.shade
  );
  useEffect(() => {
    const shadeSearch = debouncedSearchQueries.shade;
    if (shadeSearch.length > 0) {
      dispatch(
        searchShade({
          shadeCode: debouncedSearchQueries.shade,
          pageSize: pageSizes.shade,
        })
      );
    } else {
      dispatch(searchShade({ pageSize: pageSizes.shade }));
    }
  }, [debouncedSearchQueries.shade, dispatch, pageSizes.shade]);

  // Fetch quality
  const { allQualities, loading: qualityLoading } = useSelector(
    (state) => state.quality
  );
  useEffect(() => {
    const qualitySearch = debouncedSearchQueries.quality;
    if (qualitySearch.length > 0) {
      dispatch(
        searchQuality({
          qualityCode: debouncedSearchQueries.quality,
          pageSize: pageSizes.quality,
        })
      );
    } else {
      dispatch(searchQuality({ pageSize: pageSizes.quality }));
    }
  }, [debouncedSearchQueries.quality, dispatch, pageSizes.quality]);

  // Fetch customers
  const { allCustomers, loading: customerLoading } = useSelector(
    (state) => state.customer
  );
  useEffect(() => {
    const customerSearch = debouncedSearchQueries.customer;
    if (customerSearch.length > 0) {
      dispatch(
        searchCustomer({
          customerName: debouncedSearchQueries.customer,
          pageSize: pageSizes.customer,
        })
      );
    } else {
      dispatch(searchCustomer({ pageSize: pageSizes.customer }));
    }
  }, [debouncedSearchQueries.customer, dispatch, pageSizes.customer]);

  // Common function for handling scroll and loading more items
  const handleListEnd = (searchType) => {
    setPageSizes((prevSizes) => ({
      ...prevSizes,
      [searchType]: prevSizes[searchType] + 5,
    }));
  };

  // Common function for handling input change
  const handleInputChange = (type) => (event, newInputValue) => {
    setSearchQueries((prev) => ({ ...prev, [type]: newInputValue }));
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
  // --------------------------------------------------
  // template id

  // clear parent chemical data on initialization
  useEffect(() => {
    dispatch(clearChemicalData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addRecipe.text,
        path: headerURL.addRecipe.path,
      })
    );
    dispatch(fetchRecipesUnits());
    dispatch(fetchTemplates());
    dispatch(fetchChemicals({}));
    dispatch(fetchChemicalsUnits({}));
    // dispatch(fetchChemicals({ pageSize: 10, page: 1 }));
    // dispatch(fetchChemicalsUnits({ pageSize: 10, page: 1 }));
  }, [dispatch]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      templateId: "",
      shadeId: "",
      qualityId: "",
      customerId: "",
      recipeType: "",
      parentChemicals: [],
    },
    resolver: yupResolver(AddRecipeValidationSchema),
  });

  async function handleAddStep() {
    const isTemplateAlreadyAdded = parentChemicals.some(
      (parent) => parent._id === selectedTemplateId
    );

    if (isTemplateAlreadyAdded) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Template",
        text: "You cannot add the same template again.",
      });
      return;
    }

    if (selectedTemplateId) {
      const response = await dispatch(fetchTemplateById(selectedTemplateId));
      if (response?.payload?.success) {
        setisAddMasterTemplateClicked(true);
      }
    }
  }

  const onSubmit = async (data) => {
    if (!isParentChemicalsThere) {
      Swal.fire({
        icon: "info",
        text: "Please select & add master template to proceed",
      });
      return;
    }

    const { templateId, ...restData } = data;
    
    const formattedData = {
      ...restData,
      parentChemicals: parentChemicals.map((parent) => ({
        templateId: parent._id,
        childChemicals: parent.childChemicals?.length
          ? parent.childChemicals.map((child) => ({
              chemicalId: child.chemicalId,
              ratio: parseFloat(child.ratio),
              ratioUnit: child.ratioUnit,
            }))
          : [],
      })),
    };

    const response = await dispatch(createReceipe({ formattedData }));
    if (response.error) {
      Swal.fire({
        icon: "error",
        text: response?.payload?.message || "Failed to add receipe",
      });
    } else {
      Swal.fire({
        icon: "success",
        text: response?.payload?.message || "receipe added successfully",
      }).then(() => navigate(URL.viewAllRecipe));
    }
  };

  const isParentChemicalsThere = parentChemicals.length > 0;

  return (
    <section
      className={`sky-bg ${
        isParentChemicalsThere ? "h-auto" : "vh-100"
      }  pb-3 ${sectionClass}`}
    >
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
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    options={allShade}
                    getOptionLabel={(option) =>
                      `${option.shadeCode} - ${option.color}` || ""
                    }
                    onInputChange={handleInputChange("shade")}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                    value={selectedIds.shade}
                    onChange={handleSelectionChange("shade")}
                    loading={shadeLoading}
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
                          endAdornment: <>{params.InputProps.endAdornment}</>,
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
                render={({ field: { onChange } }) => (
                  <Autocomplete
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
                    loading={qualityLoading}
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
                          endAdornment: <>{params.InputProps.endAdornment}</>,
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
                  onClick={() =>
                    navigate(URL.addQuality, { state: { from: URL.addRecipe } })
                  }
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
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
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
                          endAdornment: <>{params.InputProps.endAdornment}</>,
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
                  onClick={() =>
                    navigate(URL.addCustomer, {
                      state: { from: URL.addRecipe },
                    })
                  }
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

            {/* ----------------------------------------------------------------------------------------- */}
            <Grid item xs={12}>
              <hr />
            </Grid>
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
                        setSelectedTemplateId(e.target.value);
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
                className="mt-2"
                variant="contained"
                disabled={!selectedTemplateId}
              >
                Add Master Template
              </Button>
            </Grid>

            <Grid item xs={12}>
              {!isAddMasterTemplateClicked || !parentChemicals.length > 0 ? (
                <Typography color={`red`}>
                  Please Add Master Template To View Chemical
                </Typography>
              ) : (
                <RecipeTable
                parentChemicals={parentChemicals}
                handleAddChild={(index) => handleOpenModal("add", index)}
                handleEditChildChemical={(parentIndex, childIndex) =>
                  handleOpenModal("edit", parentIndex, childIndex)
                }
                handleAddSubChild={(parentIndex, childIndex) =>
                  handleOpenModal("add", parentIndex, childIndex)
                }
                handleDeleteChildChemical={handleDeleteChildChemical}
                handleDeleteParentChemical={handleDeleteParentChemical}
                mode="add"
              />              
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                className="w100 float-end"
                type="submit"
                disabled={loading}
              >
                {recipeLoading ? <CircularProgress size={22} /> : "Save All"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      {/* add parent modal Start */}
      <ChemicalModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handle_Add_OR_EDIT_Child_Submit}
        chemicalForm={chemicalForm}
        handleChemicalFormChange={handleChemicalFormChange}
        allChemicals={allChemicals}
        ratioUnits={ratioUnits}
        mode={modalMode}
      />
    </section>
  );
};

export default AddRecipe;
