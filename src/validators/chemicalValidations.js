import * as yup from "yup";
import { patternsRegex } from "../constants/regex";

export const ChemicalValidationSchema = yup.object().shape({
  name: yup.string().trim().required("Chemical Name is required"),
  materialCode: yup
    .string()
    .trim()
    .required("Material Code is required")
    .matches(
      patternsRegex.ALPHANUMERIC_CODE_REGEX,
      "Material Code must be alphanumeric"
    ),
  classifId: yup.string().trim().required("Classification Name is required"),
  tankId: yup.string().trim().required("Tank Name is required"),
  fluidState: yup.string().trim().required("Fluid State is required"),
  minConsumption: yup
    .number()
    .typeError("Minimum Consumption must be a number")
    .required("Minimum Consumption is required"),
  maxConsumption: yup
    .number()
    .typeError("Maximum Consumption must be a number")
    .required("Maximum Consumption is required"),
  consumptionUnit: yup.string().trim().required("Consumption Unit is required"),
  ph: yup
    .number()
    .integer("PH must be an integer")
    .typeError("PH must be a integer")
    .required("PH is required"),
  phUnit: yup.string().trim().required("PH Unit is required"),
  density: yup
    .number()
    .typeError("Density must be a number")
    .required("Density is required"),
  densityUnit: yup.string().trim().required("Density Unit is required"),
  conductivity: yup
    .number()
    .typeError("Conductivity must be a number")
    .required("Conductivity is required"),
  conductivityUnit: yup.string().trim().required("Conductivity Unit is required"),
  viscosity: yup
    .number()
    .typeError("Viscosity must be a number")
    .required("Viscosity is required"),
  viscosityUnit: yup.string().trim().required("Viscosity Unit is required"),
});
