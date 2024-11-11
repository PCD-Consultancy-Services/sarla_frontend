import { patternsRegex } from "../constants/regex";
import * as Yup from "yup";

export const userValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  mobileNum: Yup.string()
    .required("Mobile number is required")
    .matches(patternsRegex.MOBILE_REGEX, "Invalid mobile number"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      patternsRegex.PASSWORD_REGEX,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const updateUserValidationSchema = Yup.object().shape({
  name: Yup.string().optional("Name is required"),
  mobileNum: Yup.string()
    .required("Mobile number is required")
    .matches(patternsRegex.MOBILE_REGEX, "Invalid mobile number"),
  email: Yup.string()
    .email("Invalid email address")
    .optional("Email is required"),
  role: Yup.string().required("Role is required"),
  // password: Yup.string().optional("Password is required"),
});
