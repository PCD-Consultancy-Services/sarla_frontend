import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Colors } from "../../common/colors";
import { Collapse } from "@mui/material";

const SidebarLink = styled(Link)`
  display: flex;
  color: ${({ $isActive }) => ($isActive ? "red" : "red")};
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 50px;
  border-right: ${({ $isActive }) =>
    $isActive && `6px solid ${Colors.secondary}`};
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: whitesmoke;
    border-radius: 2px;
    border-right: 6px solid ${Colors.secondary};
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  color: ${({ $isActive }) =>
    $isActive ? `${Colors.secondary}` : `${Colors.grey}`};
  font-weight: bold;
`;

const DropdownLink = styled(Link)`
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: blue;
  font-size: 18px;
  border-right: ${({ $isActive }) =>
    $isActive ? `6px solid ${Colors.secondary}` : "red"};

  &:hover {
    background: whitesmoke;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item?.path;

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <SidebarLink to={item?.path} onClick={handleToggle} $isActive={isActive}>
        <div className="all-center">
          {item.icon}
          <SidebarLabel $isActive={isActive}>{item.title}</SidebarLabel>
        </div>
        <div>{item.subNav && (open ? item.iconOpened : item.iconClosed)}</div>
      </SidebarLink>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {item?.subNav &&
          item?.subNav?.map((subItem, index) => (
            <React.Fragment key={index}>
              {subItem?.subNav ? (
                <SubMenu item={subItem} />
              ) : (
                <DropdownLink
                  to={subItem?.path}
                  $isActive={location.pathname === subItem?.path}
                >
                  {subItem.icon}
                  <SidebarLabel
                    style={{ textTransform: "capitalize" }}
                    $isActive={location.pathname === subItem?.path}
                  >
                    {subItem.title.replace(/-/g, " ")}
                  </SidebarLabel>
                </DropdownLink>
              )}
            </React.Fragment>
          ))}
      </Collapse>
    </>
  );
};

SubMenu.propTypes = {
  item: PropTypes.shape({
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    iconOpened: PropTypes.element.isRequired,
    iconClosed: PropTypes.element.isRequired,
    subNav: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        subNav: PropTypes.arrayOf(
          PropTypes.shape({
            path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            icon: PropTypes.element.isRequired,
          })
        ),
      })
    ),
  }).isRequired,
};

export default SubMenu;
