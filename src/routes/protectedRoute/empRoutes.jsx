import { Navigate } from "react-router-dom";

import URL from "../URLs";
//pages
import ViewShade from "../../pages/Execution/Shade/ViewShade";
import AddShade from "../../pages/Execution/Shade/AddShade";
import EditShade from "../../pages/Execution/Shade/EditShade";
import AddSchedule from "../../pages/Execution/Schedule/AddSchedule";
import EditSchedule from "../../pages/Execution/Schedule/EditSchedule";
import Dispensing from "../../pages/Execution/Dispensing/Dispensing";
import Redyeing from "../../pages/Execution/Redyeing/Redyeing";
import ViewRecipe from "../../pages/Execution/Recipe/ViewRecipe";
import AddRecipe from "../../pages/Execution/Recipe/AddRecipe";
import EditRecipe from "../../pages/Execution/Recipe/EditRecipe";
import ViewSchedule from "../../pages/Execution/Schedule/ViewSchedule";
import Profile from "../../pages/Profile/Profile";

const empProtectedRoutes = [
  { path: `*`, element: <Navigate to={`${URL.viewAllShades}`} replace /> },

  { path: `${URL.viewAllShades}`, element: <ViewShade /> },
  { path: `${URL.addShade}`, element: <AddShade /> },
  { path: `${URL.editShade}`, element: <EditShade /> },

  { path: `${URL.viewAllRecipe}`, element: <ViewRecipe /> },
  { path: `${URL.addRecipe}`, element: <AddRecipe /> },
  { path: `${URL.editRecipe}`, element: <EditRecipe /> },

  { path: `${URL.viewAllSchedule}`, element: <ViewSchedule /> },
  { path: `${URL.addSchedule}`, element: <AddSchedule /> },
  { path: `${URL.editSchedule}`, element: <EditSchedule /> },

  { path: `${URL.Dispensing}`, element: <Dispensing /> },
  { path: `${URL.Redyeing}`, element: <Redyeing /> },

  { path: `${URL.profile}`, element: <Profile /> },
];

export default empProtectedRoutes;
