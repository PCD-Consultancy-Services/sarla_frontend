import * as yup from "yup";
import { patternsRegex } from "../constants/regex";

export const ShadeValidationSchema = yup.object().shape({
  shadeCode: yup
    .string()
    .trim()
    .matches(patternsRegex.ALPHANUMERIC_CODE_REGEX, "Shade Code must be alphanumeric")
    .required("Shade Code is required"),
  color: yup
    .string()
    .trim()
    .required("Color code is required"),
});
