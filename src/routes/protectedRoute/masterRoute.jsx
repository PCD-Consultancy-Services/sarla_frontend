import URL from "../URLs";
// pages
import ListChemical from "../../pages/Masters/Chemical/ListChemical";
import ListTemplates from "../../pages/Masters/Master_Templates/ListTemplates";
import ListUsers from "../../pages/Masters/Users/ListUsers";
import Profile from "../../pages/Profile/Profile";
import ListTemplateConfig from "../../pages/Masters/Template_Config/ListTemplateConfig";
import EditTemplateConfig from "../../pages/Masters/Template_Config/EditTemplateConfig";
import ChangePasssword from "../../pages/Profile/ChangePassword";
import { Navigate } from "react-router-dom";
import Machine from "../../pages/Masters/Machine";
import Users from "../../pages/Masters/Users";
import MasterTemplate from "../../pages/Masters/Master_Templates";
import ListMachine from "../../pages/Masters/Machine/ListMachine";
import ListQuality from "../../pages/Masters/Quality/ListQuality";
import Quality from "../../pages/Masters/Quality";
import ListCustomer from "../../pages/Masters/Customer/ListCustomer";
import Customer from "../../pages/Masters/Customer";
import ListService from "../../pages/Masters/Service/ListService";
import Service from "../../pages/Masters/Service";
import Tank from "../../pages/Masters/Tank";
import ListTank from "../../pages/Masters/Tank/ListTank";
import ListClassification from "../../pages/Masters/Classification/ListClassification";
import Classification from "../../pages/Masters/Classification";
import Chemical from "../../pages/Masters/Chemical";

//Master-Routes
const masterRoutes = [
  { path: `*`, element: <Navigate to={`${URL.viewAllChemical}`} /> },
  { path: `${URL.viewAllChemical}`, element: <ListChemical /> },
  { path: `${URL.addChemical}`, element: <Chemical /> },
  { path: `${URL.editChemical}`, element: <Chemical /> },

  { path: `${URL.viewAllClassification}`, element: <ListClassification /> },
  { path: `${URL.addClassification}`, element: <Classification /> },
  { path: `${URL.editClassification}`, element: <Classification /> },

  { path: `${URL.viewAllTank}`, element: <ListTank /> },
  { path: `${URL.addTank}`, element: <Tank /> },
  { path: `${URL.editTank}`, element: <Tank /> },

  { path: `${URL.viewAllService}`, element: <ListService /> },
  { path: `${URL.addService}`, element: <Service /> },
  { path: `${URL.editService}`, element: <Service /> },

  { path: `${URL.viewAllCustomer}`, element: <ListCustomer /> },
  { path: `${URL.addCustomer}`, element: <Customer /> },
  { path: `${URL.editCustomer}`, element: <Customer /> },

  { path: `${URL.viewQuality}`, element: <ListQuality /> },
  { path: `${URL.addQuality}`, element: <Quality /> },
  { path: `${URL.editQuality}`, element: <Quality /> },

  { path: `${URL.viewMachine}`, element: <ListMachine /> },
  { path: `${URL.addMachine}`, element: <Machine /> },
  { path: `${URL.editMachine}`, element: <Machine /> },

  { path: `${URL.viewTemplate}`, element: <ListTemplates /> },
  { path: `${URL.addTemplate}`, element: <MasterTemplate /> },
  { path: `${URL.editTemplate}`, element: <MasterTemplate /> },

  { path: `${URL.viewTemplateConfig}`, element: <ListTemplateConfig /> },
  // {path : `${URL.addTemplate}` , element: <AddTemplate /> },
  { path: `${URL.editTemplateConfig}`, element: <EditTemplateConfig /> },

  { path: `${URL.viewUser}`, element: <ListUsers /> },
  { path: `${URL.addUser}`, element: <Users /> },
  { path: `${URL.editUser}`, element: <Users /> },

  { path: `${URL.profile}`, element: <Profile /> },
  { path: `${URL.changePassword}`, element: <ChangePasssword /> },
];

export default masterRoutes;
