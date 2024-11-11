import * as Yup from "yup";

export const classificationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Classification Name is required"),
});
