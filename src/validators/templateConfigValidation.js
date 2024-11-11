import * as Yup from "yup";

export const templateConfigSchema = Yup.object().shape({
  templateName: Yup.string().trim().required("Template Name is required"),
});


export const templateConfigAddSchema = Yup.object().shape({
  ChemicalName: Yup.string().trim().required("Chemical Name is required"),
  RatioName: Yup.number()
    .typeError("Ratio must be a number")
    .required("Provide a valid ratio"),
  RatioUnit: Yup.string().trim().required("Ratio Name is required"),
});