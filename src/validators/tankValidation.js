import * as yup from "yup";

export const tankValidationSchema = yup.object().shape({
  name: yup.string().trim().required("Tank Name is required"),
  solenoid_S: yup.string().trim().optional(), 
  solenoid_L: yup.string().trim().optional(), 
});
