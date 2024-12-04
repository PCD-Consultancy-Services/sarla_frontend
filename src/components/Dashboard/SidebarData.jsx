import Icons from "../../common/icons";
import URL from "../../routes/URLs";
import { AddNew, ViewAll } from "../../constants";
import { MANAGER, SUPER_ADMIN, USER } from "../../constants/roles";

export const SidebarData = [
  {
    title: "Execution",
    role: `${SUPER_ADMIN} ${MANAGER}  ${USER}`,
    icon: Icons.dashboard,
    iconClosed: Icons.arrowDownGrey,
    iconOpened: Icons.arrowUpGrey,
    subNav: [
      {
        title: "Shade",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: URL.viewAllShades,
          },
          {
            title: AddNew,
            path: URL.addShade,
          },
        ],
      },
      {
        title: "Recipe",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: URL.viewAllRecipe,
          },
          {
            title: AddNew,
            path: URL.addRecipe,
          },
        ],
      },
      {
        title: "Schedule",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: URL.viewAllSchedule,
          },
          {
            title: AddNew,
            path: URL.addSchedule,
          },
        ],
      },
      {
        title: "Dispensing",
        path: `${URL.Dispensing}`,
        subNav: [],
      },
      {
        title: "Redyeing",
        path: `${URL.Redyeing}`,
        subNav: [],
      },
    ],
  },
  {
    title: "Masters",
    role: `${SUPER_ADMIN} ${MANAGER}`,
    icon: Icons.dashboard,
    iconClosed: Icons.arrowDownGrey,
    iconOpened: Icons.arrowUpGrey,
    subNav: [
      {
        title: "Chemical",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: "View All",
            path: `${URL.viewAllChemical}`,
          },
          {
            title: "Add New",
            path: `${URL.addChemical}`,
          },
        ],
      },
      {
        title: "Classification",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewAllClassification}`,
          },
          {
            title: AddNew,
            path: `${URL.addClassification}`,
          },
        ],
      },
      {
        title: "Tank",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewAllTank}`,
          },
          {
            title: AddNew,
            path: `${URL.addTank}`,
          },
        ],
      },
      {
        title: "Service",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewAllService}`,
          },
          {
            title: AddNew,
            path: `${URL.addService}`,
          },
        ],
      },
      {
        title: "Customer",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewAllCustomer}`,
          },
          {
            title: AddNew,
            path: `${URL.addCustomer}`,
          },
        ],
      },
      {
        title: "Quality",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewQuality}`,
          },
          {
            title: AddNew,
            path: `${URL.addQuality}`,
          },
        ],
      },
      {
        title: "Machine",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewMachine}`,
          },
          {
            title: AddNew,
            path: `${URL.addMachine}`,
          },
        ],
      },
      {
        title: "Master Templates",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewTemplate}`,
          },
          {
            title: AddNew,
            path: `${URL.addTemplate}`,
          },
        ],
      },
      {
        title: "Template Config",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewTemplateConfig}`,
          },
        ],
      },
      {
        title: "Users",
        iconClosed: Icons.arrowDownBlack,
        iconOpened: Icons.arrowUpGrey,
        subNav: [
          {
            title: ViewAll,
            path: `${URL.viewUser}`,
          },
          {
            title: AddNew,
            path: `${URL.addUser}`,
          },
        ],
      },
    ],
  },
];
