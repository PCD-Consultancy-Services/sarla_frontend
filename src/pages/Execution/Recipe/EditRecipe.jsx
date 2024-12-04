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
  updateReceipe,
} from "../../../redux/Slices/Execution/RecipeSlice";
import { fetchChemicals } from "../../../redux/Slices/Master/ChemicalSlice";
import { fetchChemicalsUnits } from "../../../redux/Slices/Master/ChemicalUnitsSlice";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { fetchTemplateById } from "../../../redux/Slices/Execution/ChemicalManagement";
import RecipeTable from "../../../components/Recipe/RecipeTable";
import SearchableAutocomplete from "../../../components/SearchableAutoComplete";
import ChemicalModal from "../../../components/Recipe/ChemicalModal";
import { ChemicalModalSchema } from "../../../validators/chemicalModal.validations";

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
  const [selectedParent, setSelectedParent] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState();

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

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editRecipe.text,
        path: headerURL.editRecipe.path,
      })
    );

    dispatch(fetchRecipesUnits());
    dispatch(fetchTemplates());
    // dispatch(fetchChemicals({}));
    dispatch(fetchChemicalsUnits({}));
    dispatch(fetchChemicals({ pageSize: 10, page: 1 }));
    // dispatch(fetchChemicalsUnits({ pageSize: 10, page: 1 }));
    dispatch(getReceipe(id));
  }, [dispatch]);

  const handleAddChild = (parent) => {
    chemicalForm.reset({
      chemicalId: "",
      name: "",
      ratio: "",
      ratioUnit: "",
    });
    setSelectedParent(parent);
    setModelOpen(true);
    dispatch(fetchChemicals({}));
  };

  const handleAddChildSubmit = async (data) => {
    setModelOpen(false);
    const payload = {
      id,
      parent_id: selectedParent?.templateId._id,
      payload: {
        chemicalId: data?.chemicalId,
        ratio: data?.ratio,
        ratioUnit: data?.ratioUnit,
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

    chemicalForm.reset({ chemicalId: "", name: "", ratio: "", ratioUnit: "" });
  };

  const [modelOpen, setModelOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditChildChemical = (parent, child) => {
    setSelectedParent(parent);
    chemicalForm.reset({
      chemicalId: child?.chemicalId?._id,
      name: child?.chemicalId?.name,
      ratio: child?.ratio,
      ratioUnit: child?.ratioUnit,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateChildChemical = async (data) => {
    setIsEditModalOpen(false);
    // console.log(selectedParent);
    const payload = {
      id,
      parent_id: selectedParent?.templateId?._id,
      child_id: data.chemicalId,
      payload: {
        ratio: data.ratio,
        ratioUnit: data.ratioUnit,
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
        shadeId: receipe.shadeId._id || "",
        qualityId: receipe.qualityId._id || "",
        customerId: receipe.customerId._id || "",
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
      ...data,
      shadeId: data.shadeId,
      qualityId: data.qualityId,
      customerId: data.customerId,
    };
    const response = await dispatch(updateReceipe({ id, payload }));
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
                              _id: receipe.shadeId._id,
                              shadeCode: receipe.shadeId.shadeCode,
                              color: receipe.shadeId.color,
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
                              _id: receipe.qualityId._id,
                              qualityCode: receipe.qualityId.qualityCode,
                              qualityCodeManual:
                                receipe.qualityId.qualityCodeManual,
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
                              _id: receipe.customerId._id,
                              name: receipe.customerId.name,
                              custCode: receipe.customerId.custCode,
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
      {/* =============== add child modal Start ======================== */}

      <ChemicalModal
        open={modelOpen}
        onClose={toggleModal}
        onSubmit={handleAddChildSubmit}
        chemicalForm={chemicalForm}
        handleChemicalFormChange={chemicalForm.setValue}
        allChemicals={allChemicals}
        ratioUnits={ratioUnits}
        mode={`add`}
      />
      {/* ========== add child modal close ======================= */}

      <ChemicalModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateChildChemical}
        chemicalForm={chemicalForm}
        handleChemicalFormChange={chemicalForm.setValue}
        allChemicals={allChemicals}
        disabled={true}
        ratioUnits={ratioUnits}
        mode={`edit`}
      />
    </section>
  );
};

export default EditRecipe;
