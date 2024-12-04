import {
  AddNew,
  ChangePassword,
  Chemical,
  Classification,
  Customer,
  Dispensing,
  Edit,
  Execution,
  Machine,
  Masters,
  Profile,
  Quality,
  Redyeing,
  Recipe,
  Schedule,
  Service,
  Shade,
  Tank,
  Template,
  TemplateConfig,
  User,
  ViewAll,
  Duplicate,
} from "../constants";

const URL = {
  // auth URl

  login: "/login",
  forgetPassword: "/forgetPassword",
  resetPassword: "/reset-password",

  // Execution --------------

  //  shades
  viewAllShades: `/${Execution}/${Shade}/${ViewAll}`,
  addShade: `/${Execution}/${Shade}/${AddNew}`,
  editShade: `/${Execution}/${Shade}/${Edit}-${Shade}/:id`,


  //  Recipe
  viewAllRecipe: `/${Execution}/${Recipe}/${ViewAll}`,
  addRecipe: `/${Execution}/${Recipe}/${AddNew}`,
  editRecipe: `/${Execution}/${Recipe}/${Edit}-${Recipe}/:id`,
  duplicateRecipe: `/${Execution}/${Recipe}/${Duplicate}-${Recipe}/:id`,

  // Schedule
  viewAllSchedule: `/${Execution}/${Schedule}/${ViewAll}`,
  addSchedule: `/${Execution}/${Schedule}/${AddNew}`,
  editSchedule: `/${Execution}/${Schedule}/${Edit}-${Schedule}/:id`,

  // Dispensing
  Dispensing: `/${Execution}/${Dispensing}`,

  // Redyeing

  Redyeing : `/${Execution}/${Redyeing}`,

  //  Masters -----

  // chemical
  viewAllChemical: `/${Masters}/${Chemical}/${ViewAll}`,
  addChemical: `/${Masters}/${Chemical}/${AddNew}`,
  editChemical: `/${Masters}/${Chemical}/${Edit}-${Chemical}/:id`,

  // Classification
  viewAllClassification: `/${Masters}/${Classification}/${ViewAll}`,
  addClassification: `/${Masters}/${Classification}/${AddNew}`,
  editClassification: `/${Masters}/${Classification}/${Edit}-${Classification}/:id`,

  // Tank
  viewAllTank: `/${Masters}/${Tank}/${ViewAll}`,
  addTank: `/${Masters}/${Tank}/${AddNew}`,
  editTank: `/${Masters}/${Tank}/${Edit}-${Tank}/:id`,


  // service
  viewAllService: `/${Masters}/${Service}/${ViewAll}`,
  addService: `/${Masters}/${Service}/${AddNew}`,
  editService: `/${Masters}/${Service}/${Edit}-${Service}/:id`,


  // Customer
  viewAllCustomer: `/${Masters}/${Customer}/${ViewAll}`,
  addCustomer: `/${Masters}/${Customer}/${AddNew}`,
  editCustomer: `/${Masters}/${Customer}/${Edit}-${Customer}/:id`,

  // Quality
  viewQuality: `/${Masters}/${Quality}/${ViewAll}`,
  addQuality: `/${Masters}/${Quality}/${AddNew}`,
  editQuality: `/${Masters}/${Quality}/${Edit}-${Quality}/:id`,

  // Machine
  viewMachine: `/${Masters}/${Machine}/${ViewAll}`,
  addMachine: `/${Masters}/${Machine}/${AddNew}`,
  editMachine: `/${Masters}/${Machine}/${Edit}-${Machine}/:id`,

  // Templates
  viewTemplate: `/${Masters}/${Template}/${ViewAll}`,
  addTemplate: `/${Masters}/${Template}/${AddNew}`,
  editTemplate: `/${Masters}/${Template}/${Edit}-${Template}/:id`,

  // Templates
  viewTemplateConfig: `/${Masters}/${TemplateConfig}/${ViewAll}`,
  // addTemplateConfig: `/${Masters}/${TemplateConfig}/${AddNew}`,
  editTemplateConfig: `/${Masters}/${TemplateConfig}/${Edit}-${TemplateConfig}/:id`,

   // users
   viewUser: `/${Masters}/${User}/${ViewAll}`,
   addUser: `/${Masters}/${User}/${User}`,
   editUser: `/${Masters}/${User}/${Edit}-${User}/:id`,

  //  profile
  profile : `/${Profile}`,

    //  change password
  changePassword : `/${ChangePassword}`
};

export default URL;
