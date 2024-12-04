import { Navigate } from "react-router-dom";

import URL from "../URLs";
//pages
import AddShade from "../../pages/Execution/Shade/AddShade";
import EditShade from "../../pages/Execution/Shade/EditShade";
import Dispensing from "../../pages/Execution/Dispensing/Dispensing";
import Redyeing from "../../pages/Execution/Redyeing/Redyeing";
import AddRecipe from "../../pages/Execution/Recipe/AddRecipe";
import EditRecipe from "../../pages/Execution/Recipe/EditRecipe";
import Profile from "../../pages/Profile/Profile";
import Schedule from "../../pages/Execution/Schedule";
import ListSchedule from "../../pages/Execution/Schedule/ListSchedule";
import ListRecipe from "../../pages/Execution/Recipe/ListRecipe";
import DuplicateRecipe from "../../pages/Execution/Recipe/DuplicateRecipe";
import ListShade from "../../pages/Execution/Shade/ListShade";

const empProtectedRoutes = [
  { path: `*`, element: <Navigate to={`${URL.viewAllShades}`} replace /> },

  { path: `${URL.viewAllShades}`, element: <ListShade /> },
  { path: `${URL.addShade}`, element: <AddShade /> },
  { path: `${URL.editShade}`, element: <EditShade /> },


  { path: `${URL.viewAllRecipe}`, element: <ListRecipe /> },
  { path: `${URL.addRecipe}`, element: <AddRecipe /> },
  { path: `${URL.editRecipe}`, element: <EditRecipe /> },
  { path: `${URL.duplicateRecipe}`, element: <DuplicateRecipe /> },

  { path: `${URL.viewAllSchedule}`, element: <ListSchedule /> },
  { path: `${URL.addSchedule}`, element: <Schedule /> },
  { path: `${URL.editSchedule}`, element: <Schedule /> },

  { path: `${URL.Dispensing}`, element: <Dispensing /> },
  { path: `${URL.Redyeing}`, element: <Redyeing /> },

  { path: `${URL.profile}`, element: <Profile /> },
];

export default empProtectedRoutes;
