import React from "react";
import "./components_css/navbar.css";
import {
    NavLink,
} from "react-router-dom";

import { RiHome3Line } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { RiMessage2Line } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
const Navbar = () => {
    return (
        <>
        <div className="navbar">
            <NavLink to="/home">
            <RiHome3Line  className="menu-icon home-icon"/>
            </NavLink>

            <NavLink to="/caregiver">
            <ImProfile className="menu-icon" />
            </NavLink>      

            <NavLink to="/scheduling">
            <FaRegCalendarAlt className="menu-icon" />
            </NavLink>

            <NavLink to="/message-history">
            <RiMessage2Line className="menu-icon home-icon"/>
            </NavLink>

            <NavLink to="/user-dashboard">
                <FaRegUser className="menu-icon"/>
            </NavLink>
        </div>
                 
        </>
    );
};

export default Navbar;
