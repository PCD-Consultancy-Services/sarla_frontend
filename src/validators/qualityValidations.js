import * as yup from "yup";

export const qualitySchema = yup.object().shape({
  qualityAbbr: yup.string().trim().required("Quality attribute is required"),
  qualityCode: yup.string().trim().required("Quality code is required"),
  qualityCodeManual: yup.string().trim().required("Quality code manual is required"),
  productCateg: yup.string().trim().required("Product category is required"),
  denierPrefix: yup.string().trim().required("Denier prefix is required"),
  denier: yup
    .number()
    .typeError("Denier must be a number")
    .required("Denier numeric value is required"),
  filamentPrefix: yup.string().trim().required("Filament prefix is required"),
  filament: yup
    .number()
    .typeError("Filament must be a number")
    .required("Filament numeric value is required"),
  plyPrefix: yup.string().trim().required("Ply prefix is required"),
  ply: yup
    .number()
    .typeError("Ply must be a number")
    .required("Ply numeric value is required"),
  process: yup.string().trim().required("Process is required"),
  tpm: yup.number()
    .typeError("TPM value must be a number")
    .required("TPM value is required"),
  isLub: yup.boolean().required("Lubrication value is required"),
  lustre: yup.string().trim().required("Lustre is required"),
  shadePrefix: yup.string().trim().required("Shade prefix is required"),
  shade: yup.string().trim().when("shadePrefix", {
    is: "RW",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Shade value is required"),
  }),
  serviceId: yup.string().trim().required("Service is required"),
});
