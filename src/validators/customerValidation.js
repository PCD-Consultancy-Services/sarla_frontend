import * as yup from "yup";
import { patternsRegex } from "../constants/regex";

export const CustomerValidationSchema = yup.object().shape({
  name: yup.string().trim().required("Customer Name is required"),
  custCode: yup
    .string()
    .trim()
    .required("Customer code is required")
    .matches(
      patternsRegex.CUSTOMER_CODE_REGEX,
      "Provide valid customer code up to 7 digits."
    ),
});
