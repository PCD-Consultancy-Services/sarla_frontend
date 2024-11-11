import { Navigate } from "react-router-dom";

import URL from "../URLs";

import Login from "../../pages/Auth/Login/Login";
import ForgetPassword from "../../pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "../../pages/Auth/ResetPassword/ResetPassword";


// auth-routes
const privateRoutes = [
    { path: `*`, element: <Navigate to="/login" replace /> },
    { path: `${URL.login}`, element: <Login /> },
    { path: `${URL.forgetPassword}`, element: <ForgetPassword /> },
    { path: `${URL.resetPassword}`, element: <ResetPassword /> },

];

export default privateRoutes;