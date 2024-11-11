import * as yup from "yup";
import { patternsRegex } from "../constants/regex";

export const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      patternsRegex.PASSWORD_REGEX,
      "Password must include at least one uppercase letter and one special character"
    ),
});

export const forgetPasswordschema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});


export const resetPasswordschema = yup.object().shape({
  newPassword: yup.string().required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required("Confirm Password is required"),
});

export const changePasswordschema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup.string().required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});