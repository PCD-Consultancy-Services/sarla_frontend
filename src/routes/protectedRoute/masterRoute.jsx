import URL from "../URLs";
// pages
import ViewChemical from "../../pages/Masters/Chemical/ViewChemical";
import AddChemical from "../../pages/Masters/Chemical/AddChemical";
import EditChemical from "../../pages/Masters/Chemical/EditChemical";
import ViewClassification from "../../pages/Masters/Classification/ViewClassification";
import AddClassification from "../../pages/Masters/Classification/AddClassification";
import EditClassification from "../../pages/Masters/Classification/EditClassification";
import ViewTank from "../../pages/Masters/Tank/ViewTank";
import AddTank from "../../pages/Masters/Tank/AddTank";
import EditTank from "../../pages/Masters/Tank/EditTank";
import ViewCustomer from "../../pages/Masters/Customer/ViewCustomer";
import AddCustomer from "../../pages/Masters/Customer/AddCustomer";
import EditCustomer from "../../pages/Masters/Customer/EditCustomer";
import ViewQuality from "../../pages/Masters/Quality/ViewQuality";
import AddQuality from "../../pages/Masters/Quality/AddQuality";
import EditQuality from "../../pages/Masters/Quality/EditQuality";
import AddMachine from "../../pages/Masters/Machine/AddMachine";
import ViewMachine from "../../pages/Masters/Machine/ViewMachine";
import EditMachine from "../../pages/Masters/Machine/EditMachine";
import ViewTemplate from "../../pages/Masters/Master_Templates/ViewTemplate";
import AddTemplate from "../../pages/Masters/Master_Templates/AddTemplate";
import EditTemplate from "../../pages/Masters/Master_Templates/EditTemplate";
import AddUser from "../../pages/Masters/Users/AddUser";
import ViewUser from "../../pages/Masters/Users/ViewUser";
import EditUser from "../../pages/Masters/Users/EditUser";
import Profile from "../../pages/Profile/Profile";
import ViewService from "../../pages/Masters/Service/ViewService";
import AddService from "../../pages/Masters/Service/AddService";
import EditService from "../../pages/Masters/Service/EditService";
import ViewTemplateConfig from "../../pages/Masters/Template_Config/ViewTemplateConfig";
import EditTemplateConfig from "../../pages/Masters/Template_Config/EditTemplateConfig";
import ChangePasssword from "../../pages/Profile/ChangePassword";
import { Navigate } from "react-router-dom";

//Master-Routes
const masterRoutes = [
  { path: `*`, element: <Navigate to={`${URL.viewAllChemical}`} /> },
  { path: `${URL.viewAllChemical}`, element: <ViewChemical /> },
  { path: `${URL.addChemical}`, element: <AddChemical /> },
  { path: `${URL.editChemical}`, element: <EditChemical /> },

  { path: `${URL.viewAllClassification}`, element: <ViewClassification /> },
  { path: `${URL.addClassification}`, element: <AddClassification /> },
  { path: `${URL.editClassification}`, element: <EditClassification /> },

  { path: `${URL.viewAllTank}`, element: <ViewTank /> },
  { path: `${URL.addTank}`, element: <AddTank /> },
  { path: `${URL.editTank}`, element: <EditTank /> },

  { path: `${URL.viewAllService}`, element: <ViewService /> },
  { path: `${URL.addService}`, element: <AddService /> },
  { path: `${URL.editService}`, element: <EditService /> },

  { path: `${URL.viewCustomer}`, element: <ViewCustomer /> },
  { path: `${URL.addCustomer}`, element: <AddCustomer /> },
  { path: `${URL.editCustomer}`, element: <EditCustomer /> },

  { path: `${URL.viewQuality}`, element: <ViewQuality /> },
  { path: `${URL.addQuality}`, element: <AddQuality /> },
  { path: `${URL.editQuality}`, element: <EditQuality /> },

  { path: `${URL.viewMachine}`, element: <ViewMachine /> },
  { path: `${URL.addMachine}`, element: <AddMachine /> },
  { path: `${URL.editMachine}`, element: <EditMachine /> },

  { path: `${URL.viewTemplate}`, element: <ViewTemplate /> },
  { path: `${URL.addTemplate}`, element: <AddTemplate /> },
  { path: `${URL.editTemplate}`, element: <EditTemplate /> },

  { path: `${URL.viewTemplateConfig}`, element: <ViewTemplateConfig /> },
  // {path : `${URL.addTemplate}` , element: <AddTemplate /> },
  { path: `${URL.editTemplateConfig}`, element: <EditTemplateConfig /> },

  { path: `${URL.viewUser}`, element: <ViewUser /> },
  { path: `${URL.addUser}`, element: <AddUser /> },
  { path: `${URL.editUser}`, element: <EditUser /> },

  { path: `${URL.profile}`, element: <Profile /> },
  { path: `${URL.changePassword}`, element: <ChangePasssword /> },
];

export default masterRoutes;
