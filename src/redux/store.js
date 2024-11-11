import { configureStore } from "@reduxjs/toolkit";
import themeSetting from "./Slices/Theme/themeSetting";

import AuthSlice from "./Slices/Auth/AuthSlice";
import changePasswordSlice from "./Slices/Auth/changePassword"
import UsersSlice from "./Slices/Master/UsersSlice";
import RolesSlice from "./Slices/Master/RolesSlice";
import TankSlice from "./Slices/Master/TankSlice";
import CustomerSlice from "./Slices/Master/CustomerSlice";
import classificationSlice from "./Slices/Master/ClassificationSlice";
import ServiceSlice from "./Slices/Master/ServiceSlice";
import ChemicalSlice from "./Slices/Master/ChemicalSlice";
import ChemicalUnitsSlice from "./Slices/Master/ChemicalUnitsSlice";
import QualityUnitsSlice from "./Slices/Master/QualityUnits";
import QualitySlice from "./Slices/Master/QualitySlice";
import MachineSlice from "./Slices/Master/MachineSlice";
import masterTemplateSlice from "./Slices/Master/MasterTemplateSlice";
import forgetPasswordSlice from "./Slices/Auth/ForgetPassword"
import ShadeSlice from "./Slices/Execution/ShadeSlice";
import recipeUnitsSlice from "./Slices/Execution/RecipeUnitsSlice"
import TempRecipeSlice from "./Slices/Execution/TempRecipeSlice ";
import RecipeSlice from "./Slices/Execution/RecipeSlice";
import ChemicalManagement from "./Slices/Execution/ChemicalManagement";
import scheduleSlice from "./Slices/Execution/scheduleSlice";
import RecipeForSchdule from "./Slices/Execution/RecipeForSchdule";
import DispensingSlice from "./Slices/Execution/DispensingSlice";
import SlipNumSlice from "./Slices/Execution/SlipNumSlice";

export const store = configureStore({
  reducer: {
    theme: themeSetting,
    auth: AuthSlice,
    forgetPassword:forgetPasswordSlice,
    changePassword:changePasswordSlice,
    users: UsersSlice,
    roles: RolesSlice,
    tanks: TankSlice,
    customer: CustomerSlice,
    classification: classificationSlice,
    service: ServiceSlice,
    chemical: ChemicalSlice,
    chemicalUnits: ChemicalUnitsSlice,
    recipeUnits:recipeUnitsSlice,
    qualityUnits: QualityUnitsSlice,
    quality: QualitySlice,
    machine: MachineSlice,
    masterTemplate: masterTemplateSlice,
    // Execution //
    shade:ShadeSlice,
    tempRecipe:TempRecipeSlice,
    recipe:RecipeSlice,
    manageChemicals :  ChemicalManagement,
    schedule:scheduleSlice,
    receipeForSchedule : RecipeForSchdule,
    dispensing:DispensingSlice,
    // slipnumber by cardbatch
    slipNum :  SlipNumSlice
  },
});
