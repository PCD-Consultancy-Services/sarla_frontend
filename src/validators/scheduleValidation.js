import * as Yup from "yup";
import { patternsRegex } from "../constants/regex";

export const scheduleValidationSchema = Yup.object().shape({
  PINo: Yup.string()
    .matches(
      patternsRegex.ALPHANUMERIC_CODE_REGEX,
      "PI Number must be alphanumeric"
    )
    .required("PI Number is required"),
  machineId: Yup.string().required("Machine Name is required"),
  shadeId: Yup.string().required("Shade ID is required"),
  cardBatch: Yup.string().required("Card Batch is required"),
  RMLotNum: Yup.string().required("RM Lot Number is required"),
  // finishMaterial: Yup.string()
  //   .matches(
  //     patternsRegex.ALPHANUMERIC_CODE_REGEX,
  //     "Finish Material must be alphanumeric"
  //   )
  //   .required("Finish Material is required"),
  qualityId: Yup.string().required("RM Material is required"),
  customerId: Yup.string().required("Customer ID is required"),
  recipeType: Yup.string().required("Recipe Type is required"),
  slipNumber: Yup.string()
    .matches(
      patternsRegex.ALPHANUMERIC_CODE_REGEX,
      "Slip Number must be alphanumeric"
    )
    .required("Slip Number is required"),
  // RMMaterial: Yup.string().required("RM Material is required"),
  batchWt: Yup.string().required("Batch Weight is required"),
  cones: Yup.number().required("Cones is required"),
  // remarks: Yup.string().required("Remarks are required"),
  programNum: Yup.string().required("Program Number is required"),
});
