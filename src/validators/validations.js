import * as yup from "yup";
import { patternsRegex } from "../constants/regex";

export const validateFormFields = (formFields) => {
  const errors = {};

  for (const field in formFields) {
    const value = formFields[field];
    if (typeof value === 'string' && !value.trim()) {
      errors[field] = `${field} is required`;
    } else if (!value) {
      errors[field] = `${field} is required`;
    }
  }
  
  return errors;
};


