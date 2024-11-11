import * as Yup from 'yup';

const BaseRecipeValidationSchema = Yup.object().shape({
  shadeId: Yup.string().trim().required("Shade is required"),
  qualityId: Yup.string().trim().required("Quality name is required"),
  customerId: Yup.string().trim().required("Customer name is required"),
  recipeType: Yup.string().trim().required("Recipe Type name is required"),
});

export const AddRecipeValidationSchema = BaseRecipeValidationSchema.shape({
  parentChemicals: Yup.array().required("Parent chemicals are required"),
});

export const EditRecipeValidationSchema = BaseRecipeValidationSchema;