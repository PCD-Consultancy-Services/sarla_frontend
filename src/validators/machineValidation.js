import * as Yup from "yup";

export const machineSchema = Yup.object().shape({
  name: Yup.string().trim().required("Machine name is required"),
  serviceId: Yup.string().trim().required("Service name is required"),
  nylonKg: Yup.number()
    .typeError("NylonKg must be a number")
    .required("NylonKg is required"),
  literage: Yup.number()
    .typeError("Literage must be a number")
    .required("Literage is required"),
  nylonRatio: Yup.number()
    .typeError("Nylon ratio must be a number")
    .required("Nylon ratio is required"),
});
