import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import { useNavigate, useParams } from "react-router-dom";
import { searchShade } from "../../../redux/Slices/Execution/ShadeSlice";
import { searchQuality } from "../../../redux/Slices/Master/QualitySlice";
import { searchCustomer } from "../../../redux/Slices/Master/CustomerSlice";
import { fetchRecipesUnits } from "../../../redux/Slices/Execution/RecipeUnitsSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddRecipeValidationSchema,
  EditRecipeValidationSchema,
} from "../../../validators/recipeValidation";
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
  getReceipeForDuplicateAdd,
  updateChildChemical,
} from "../../../redux/Slices/Execution/ChemicalManagement";
import Swal from "sweetalert2";
import ChemicalModal from "../../../components/Recipe/ChemicalModal";
import RecipeTable from "../../../components/Recipe/RecipeTable";
import { fetchChemicalsUnits } from "../../../redux/Slices/Master/ChemicalUnitsSlice";
import SearchableAutocomplete from "../../../components/SearchableAutoComplete";
import { ChemicalModalSchema } from "../../../validators/chemicalModal.validations";

const DuplicateRecipe = () => {
  // -------------------------------------------------------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
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

  const {
    parentChemicals,
    loading: chemicalManageinLoad,
    recipeType,
    shadeId,
    qualityId,
    customerId,
  } = useSelector((state) => state.manageChemicals);

  const { allShade } = useSelector((state) => state.shade);

  const { allQualities } = useSelector((state) => state.quality);

  const { allCustomers } = useSelector((state) => state.customer);

  const chemicalForm = useForm({
    defaultValues: {
      chemicalId: "",
      name: "",
      ratio: "",
      ratioUnit: "",
    },
    resolver: yupResolver(ChemicalModalSchema),
  });

  const handle_Add_OR_EDIT_Child_Submit = (data) => {
    if (modalMode === "add") {
        const existingChildChemicals = parentChemicals[editingIndex.parentIndex].childChemicals;
        const isDuplicate = existingChildChemicals.some(child => child.chemicalId === data.chemicalId);
        if (isDuplicate) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Chemical",
                text: "This chemical has already been added.",
            });
            setModalOpen(false)
            return; // Prevent further execution
        }

        if (editingIndex.childIndex !== null) {
            dispatch(
                addSubChildChemical({
                    parentIndex: editingIndex.parentIndex,
                    childIndex: editingIndex.childIndex,
                    subChildChemical: data,
                })
            );
        } else {
            dispatch(
                addChildChemical({
                    parentIndex: editingIndex.parentIndex,
                    childChemical: data,
                })
            );
        }
    } else if (modalMode === "edit") {
        dispatch(
            updateChildChemical({
                parentIndex: editingIndex.parentIndex,
                childIndex: editingIndex.childIndex,
                updatedChild: data,
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
      const childChemical =
        parentChemicals[parentIndex].childChemicals[childIndex];
      chemicalForm.reset({
        chemicalId: childChemical.chemicalId,
        name: childChemical.name,
        ratio: childChemical.ratio,
        ratioUnit: childChemical.ratioUnit,
      });
    } else if (mode === "add") {
      chemicalForm.reset({
        chemicalId: "",
        name: "",
        ratio: "",
        ratioUnit: "",
      });
      dispatch(fetchChemicals({}));
    }

    setEditingIndex({ parentIndex, childIndex });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    chemicalForm.reset();
  };

  const handleDeleteParentChemical = (index) => {
    dispatch(deleteParentChemical(index));
  };

  const handleDeleteChildChemical = (parentIndex, childIndex) => {
    dispatch(deleteChildChemical({ parentIndex, childIndex }));
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
        text: headerURL.duplicateRecipe.text,
        path: headerURL.duplicateRecipe.path,
      })
    );
    dispatch(fetchRecipesUnits());
    dispatch(fetchTemplates());
    dispatch(fetchChemicalsUnits({}));
    dispatch(fetchChemicals({ pageSize: 10, page: 1 }));
    // dispatch(fetchChemicalsUnits({ pageSize: 10, page: 1 }));

    // initial data for shade , customer , quality
    dispatch(searchShade({}));
    dispatch(searchCustomer({}));
    dispatch(searchQuality({}));

    //   dispatch(getReceipe(id));
    dispatch(getReceipeForDuplicateAdd(id));
  }, [dispatch]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
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
    resolver: yupResolver(EditRecipeValidationSchema),
  });

  useEffect(() => {
    if (recipeType) {
      reset({
        recipeType: recipeType || "",
        shadeId: shadeId._id || "",
        qualityId: qualityId._id || "",
        customerId: customerId._id || "",
      });
    }
    // console.log(receipe, "see here====================================");
  }, [recipeType, reset]);

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
      dispatch(fetchTemplateById(selectedTemplateId));
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
      shadeId: data.shadeId,
      qualityId: data.qualityId,
      customerId: data.customerId,
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

  console.log(parentChemicals);
  return (
    <section className={`sky-bg h-auto  pb-3 ${sectionClass}`}>
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
              <FormControl fullWidth className="formInput">
                <Controller
                  name="shadeId"
                  control={control}
                  render={({ field }) => (
                    <SearchableAutocomplete
                      {...field}
                      control={control}
                      fieldName="shadeId"
                      getOptionLabel={(option) =>
                        `${option.shadeCode} - ${option.color}` || ""
                      }
                      dispatch={dispatch}
                      searchAction={searchShade}
                      options={allShade}
                      valueResolver={() =>
                        // Logic to resolve the initial value
                        allShade?.find((sh) => sh._id === watch("shadeId")) ||
                        (watch("shadeId")
                          ? {
                              _id: shadeId._id,
                              shadeCode: shadeId.shadeCode,
                              color: shadeId.color,
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
              <FormControl fullWidth className="formInput">
                <Controller
                  name="qualityId"
                  control={control}
                  render={({ field }) => (
                    <SearchableAutocomplete
                      {...field}
                      control={control}
                      fieldName="qualityId"
                      getOptionLabel={(option) =>
                        `${option.qualityCode} - ${option.qualityCodeManual}` ||
                        ""
                      }
                      dispatch={dispatch}
                      searchAction={searchQuality}
                      options={allQualities}
                      valueResolver={() =>
                        // Logic to resolve the initial value
                        allQualities?.find(
                          (quality) => quality._id === watch("qualityId")
                        ) ||
                        (watch("qualityId")
                          ? {
                              _id: qualityId._id,
                              qualityCode: qualityId.qualityCode,
                              qualityCodeManual: qualityId.qualityCodeManual,
                            }
                          : null)
                      }
                      setValue={setValue}
                      errors={errors}
                      label="Select Quality"
                    />
                  )}
                />
              </FormControl>
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
              <FormControl fullWidth className="formInput">
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <SearchableAutocomplete
                      {...field}
                      control={control}
                      fieldName="customerId"
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.custCode}` || ""
                      }
                      dispatch={dispatch}
                      searchAction={searchCustomer}
                      options={allCustomers}
                      valueResolver={() =>
                        // Logic to resolve the initial value
                        allCustomers?.find(
                          (cust) => cust._id === watch("customerId")
                        ) ||
                        (watch("customerId")
                          ? {
                              _id: customerId._id,
                              name: customerId.name,
                              custCode: customerId.custCode,
                            }
                          : null)
                      }
                      setValue={setValue}
                      errors={errors}
                      label="Select Customer"
                    />
                  )}
                />
              </FormControl>
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
              <FormControl fullWidth className="formInput">
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
              </FormControl>
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
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
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
              {!parentChemicals.length > 0 ? (
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
        handleChemicalFormChange={chemicalForm.setValue}
        allChemicals={allChemicals}
        ratioUnits={ratioUnits}
        mode={modalMode}
      />
    </section>
  );
};

export default DuplicateRecipe;
