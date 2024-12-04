import React from 'react';
import { MdDashboard } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Colors } from './colors'; 
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";

const Icons = {
  dashboard: <MdDashboard color={Colors.grey} size={30} />,
  arrowDownBlack: <IoIosArrowDown color="black" />,
  arrowDownGrey: <IoIosArrowDown color={Colors.black} />,
  viewIcon: <FaEye color={Colors.secondary} size={22}/>,
  editIcon : <FaRegEdit  color={Colors.secondary} size={22}/>,
  deleteIcon : <MdDelete  color={Colors.secondary} size={22}/>,
  arrowUpGrey: <IoIosArrowUp color={Colors.grey} />,
  copyIcon : <FaRegCopy  color={Colors.secondary} size={22}/>
}

export default Icons;
