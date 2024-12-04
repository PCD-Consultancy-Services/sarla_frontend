import * as yup from "yup";

export const ChemicalModalSchema = yup.object().shape({
    chemicalId: yup.string().required('Chemical is required'),
    name: yup.string().required('Chemical name is required'),
    ratio: yup.string().required('Ratio is required')
      .matches(/^[0-9]+(\.[0-9]+)?$/, 'Ratio must be a number'),
    ratioUnit: yup.string().required('Ratio unit is required'),
  });