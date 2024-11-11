import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { Avatar, Button, Popover, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LuPanelLeftClose } from "react-icons/lu";
import { Colors } from "../../common/colors";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useLogout from "../../hooks/useLogout";
import { User } from "../../constants";
import { IoMdArrowDropdown } from "react-icons/io";
import { updateState } from "../../redux/Slices/Theme/themeSetting";
import { Images } from "../../assets";

const Nav = styled.div`
  background: #f4f7fe;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  width: 270px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #fff;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ $sidebar }) => ($sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MenuContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const DepartmentsRow = styled.div`
  display: flex;
  width: 100%;
  padding-right: 30px;
  justify-content: space-between;
`;

const SearchSide = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 10px 12px;
  border-radius: 25px;
`;

const Footer = styled.div`
  padding: 20px 0;
  font-size: 14px;
  font-weight: bolder;
  text-align: center;
`;

const Sidebar = ({ roleKey }) => {
  // const { user } = useSelector((state) => state.auth);

  const [sidebar, setSidebar] = useState(true);
  const [sideBarData, setSidebarData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const logOutFunc = useLogout();

  useEffect(() => {
    // Create a deep copy of SidebarData to avoid mutating the original array
    const filteredData = SidebarData.map((item) => ({
      ...item,
      subNav: item.subNav ? [...item.subNav] : [],
    }));
    // Filter data based on roleKey
    const roleBasedData = filteredData.filter(
      (data) => data.role && data.role.includes(roleKey)
    );

    // For the "MANAGER" role, remove the "Users" submenu
    if (roleKey === "MANAGER") {
      roleBasedData.forEach((item) => {
        item.subNav = item.subNav.filter(
          (subNavTab) => subNavTab.title !== "Users"
        );
      });
    }

    // Update the state with the filtered data
    setSidebarData(roleBasedData);
  }, [roleKey]);

  const state = useSelector((state) => state.theme.itemText);

  let path = state.path.split("/");

  let newPath = path.map((p, i) => {
    if (i === path.length - 1) {
      return (
        <span key={i} className="nav-header-text green-text">
          {p}
        </span>
      );
    } else {
      return (
        <span key={i} className="nav-header-text silver-text">
          {p}
        </span>
      );
    }
  });

  const linkClass = !sidebar ? "linkClass" : "";

  const dispatch = useDispatch();

  const showSidebar = () => {
    setSidebar(!sidebar);
    dispatch(updateState());
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    logOutFunc();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const data = JSON.parse(localStorage.getItem(User));

  const openLinkInNewTab = () => {
    window.open("https://pcdconsultancyservices.in/", "_blank");
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#" className={`nav-link ${linkClass}`}>
            <FaIcons.FaBars onClick={showSidebar} color="black" />
          </NavIcon>

          <DepartmentsRow>
            <div className="departmentDiv">
              <label>{newPath}</label>
              <h2 className="heading">{state.text}</h2>
            </div>

            <SearchSide>
              <div className=" px-3">
                {/* <SearchIcon className="search-Icon" /> */}
                {/* <input
                  type="text"
                  placeholder="Search"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "10px",
                    outline: "none",
                  }}
                /> */}
                <Typography
                  className="h5 fw-bold"
                  sx={{ color: Colors.primary }}
                >
                  Welcome: {data?.name}
                </Typography>
              </div>
              {/* <NotificationsOutlinedIcon className="search-Icon" /> */}
              <Link
                className="d-flex align-items-center"
                onClick={handleAvatarClick}
              >
                <Avatar
                  alt="Rem Sharp"
                  src={Images.profileImage}
                  // onClick={handleAvatarClick}
                />
                <IoMdArrowDropdown color={Colors.primary} />
              </Link>
            </SearchSide>
          </DepartmentsRow>
        </Nav>

        <SidebarNav $sidebar={sidebar} className="sidebar-menu">
          <SidebarWrap>
            <img src={Images.sarla} className="sarla-main-logo" alt="" />

            <hr
              style={{ marginBottom: "20px", border: "1px solid whitesmoke" }}
            />

            <LuPanelLeftClose
              onClick={showSidebar}
              style={{
                color: `${Colors.grey}`,
                position: "absolute",
                top: "110px",
                left: "210px",
                fontSize: "25px",
                background: "white",
              }}
            />

            <MenuContainer>
              {sideBarData.map((item, index) => {
                return <SubMenu key={index} item={item} />;
              })}
            </MenuContainer>
            <Footer onClick={openLinkInNewTab}>
              Powered by <br />
              <span className="company-name">PCD Consultancy Services.</span>
            </Footer>
          </SidebarWrap>
        </SidebarNav>

        <Popover
          id={id}
          open={open}
          className="w-100 mt-1"
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography className="d-flex flex-column">
            <div className="px-3 py-2">
              <PersonIcon sx={{ fill: Colors.primary }} />
              <Button
                sx={{ color: Colors.primary }}
                component={Link}
                to="/profile"
              >
                Profile
              </Button>
            </div>

            <div className="px-3 py-2">
              <ExitToAppIcon sx={{ fill: Colors.primary }} />
              <Button sx={{ color: Colors.primary }} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Typography>
        </Popover>
      </IconContext.Provider>
    </>
  );
};

Sidebar.propTypes = {
  // role: PropTypes.shape({
  //   key: PropTypes.string.isRequired,
  // }).isRequired,
  roleKey: PropTypes.string.isRequired,
};

export default Sidebar;
