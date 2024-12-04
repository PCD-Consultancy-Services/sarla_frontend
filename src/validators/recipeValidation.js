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

// edit
// need when it is object or string both
// const BaseEditRecipeValidationSchema = Yup.object().shape({
//   shadeId: Yup.mixed()
//     .test('is-valid-shade', 'Shade is required', (value) => {
//       // Check if it's a non-empty string or an object with an ID
//       return value && (typeof value === 'string' ? value.trim() !== '' : value._id);
//     }),
//   qualityId: Yup.mixed()
//     .test('is-valid-quality', 'Quality name is required', (value) => {
//       // Check if it's a non-empty string or an object with an ID
//       return value && (typeof value === 'string' ? value.trim() !== '' : value._id);
//     }),
//   customerId: Yup.mixed()
//     .test('is-valid-customer', 'Customer name is required', (value) => {
//       // Check if it's a non-empty string or an object with an ID
//       return value && (typeof value === 'string' ? value.trim() !== '' : value._id);
//     }),
//   recipeType: Yup.string().trim().required("Recipe Type name is required"),
// });

export const EditRecipeValidationSchema = BaseRecipeValidationSchema;