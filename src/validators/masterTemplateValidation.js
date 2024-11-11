import * as Yup from "yup";

export const masterTemplateSchema = Yup.object().shape({
  name: Yup.string().trim().required("Template Name is required"),
});
