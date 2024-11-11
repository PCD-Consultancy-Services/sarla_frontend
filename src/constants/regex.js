export const patternsRegex = {
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
  MOBILE_REGEX: /^\d{10}$/,
  ROLE_REGEX: /^[A-Z0-9_]+$/,
  PERMISSIONS_REGEX: /^[a-z0-9_]+$/,
  CLASSIF_REGEX: /^[a-z0-9_]+$/,
  ALPHANUMERIC_CODE_REGEX: /^[a-zA-Z0-9]+$/,
  CUSTOMER_CODE_REGEX: /^\d{1,7}$/,
  QUALITY_CODE_REGEX: /^[A-Z0-9]+$/,
  QUALITY_SHADE_REGEX: /^[a-zA-Z0-9$-@%]+$/,
  SHADE_CODE_REGEX: /^[a-zA-Z0-9$-@%]+$/,
  SHADE_COLOR_REGEX: /^[A-Z$-&_@%]+$/,

};
