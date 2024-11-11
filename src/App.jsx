// src/App.js
import React from "react";
import "./App.css";
import Sidebar from "./components/Dashboard/Sidebar";
import { Route, Routes } from "react-router-dom";
import empProtectedRoutes from "./routes/protectedRoute/empRoutes";
import privateRoutes from "./routes/privateRoute/private";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/global.css";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material";
import theme from "./common/theme";
import { MANAGER, SUPER_ADMIN, USER } from "./constants/roles";
import masterRoutes from "./routes/protectedRoute/masterRoute";
import URL from "./routes/URLs";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./components/GlobalErrorHandler/ErrorFallBack";


function App() {
  const { user } = useSelector((state) => state.auth);

  const managerFilterFn = (route) => {
    const restrictedPaths = [URL.viewUser, URL.addUser, URL.editUser];
    return !restrictedPaths.includes(route.path);
  };

  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      {user && <Sidebar roleKey={user.role.key} />}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          {/* auth routes */}
          {!user &&
            privateRoutes.map((route, index) => <Route key={index} {...route} />)}

          {/* only master admin route */}
          {user?.role?.key === SUPER_ADMIN && (
            <>
              {empProtectedRoutes.map((route, index) => (
                <Route key={index} {...route} />
              ))}
              {masterRoutes.map((route, index) => (
                <Route key={index + empProtectedRoutes.length} {...route} />
              ))}
            </>
          )}
          {/* only manager routes */}
          {user?.role?.key === MANAGER && (
            <>
              {empProtectedRoutes.map((route, index) => (
                <Route key={index} {...route} />
              ))}
              {masterRoutes.filter(managerFilterFn).map((route, index) => (
                <Route key={index + empProtectedRoutes.length} {...route}   />
              ))}
            </>
          )}

          {/* employee route (master admin has access to employee routes) */}
          {user?.role?.key === USER &&
            empProtectedRoutes.map((route, index) => (
              <Route key={index} {...route}  />
            ))}
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
