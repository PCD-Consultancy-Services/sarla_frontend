import * as Yup from "yup";

export const serviceSchema = Yup.object().shape({
  name: Yup.string().trim().required("Service Name is required"),
});