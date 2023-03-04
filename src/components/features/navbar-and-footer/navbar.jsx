import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAppContext } from "../../../context.js";
import PortraitImage from "../../../static/personal-pictures/portrait/alan-portrait.jpg";
import HideNavIcon from "../../../static/icons/arrow-left.png";
import ShowNavIcon from "../../../static/icons/arrow-right.png";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    setNavCollapsed,
    setThemeSwitch,
    setLoggedIn,
    adminLoggedIn,
    userLoggedIn,
    themeSwitch
  } = useAppContext();

  const [changeIcon, setChangeIcon] = useState(true);

  function handleNavbarMinimized() {
      setNavCollapsed(true);
      setChangeIcon(true);
  }

  function handleNavbarMaximized() {
    setNavCollapsed(false);
    setChangeIcon(false);
  }

  function handleSignOut() {
    setLoggedIn("GUEST");
    localStorage.setItem("admin_token", null);
    localStorage.setItem("user_token", null);
    navigate("/");
  }

  function handleTheme() {
    if (themeSwitch === false) {
      setThemeSwitch(true);
    } else {
      setThemeSwitch(false);
    }
  }

  return (
    <>
      <div className="nav-wrapper">
        {changeIcon ? (
          <div className="collapse-icon" onClick={ handleNavbarMaximized }>
            <img alt="Right-Arrow-Uncollapse-Icon" className="navIcon" src={ ShowNavIcon } />
          </div>
        ) : (
          <div className="collapse-icon" onClick={ handleNavbarMinimized }>
            <img alt="Left-Arrow-Collapse-Icon" className="navIcon" src={ HideNavIcon } />
          </div>
        )}

        <div className='main-contents-wrapper'>
          <div className="header-name">Alan McCall</div>

          <div className="background-support">
            <div className="profile-picture">
              <img alt="PortraitImage" src={ PortraitImage } />
            </div>
          </div>

          <NavLink
            to="/"
            className="nav-link"
          >
            <div className="link-wrapper">
              <div className="link-content">Home</div>
            </div>
          </NavLink>

          <div className="home-links">
              <a href="/#about" className="home-id">About -</a>
              <a href="/#mission" className="home-id">Mission -</a>
              <a href="/#projects" className="home-id">Projects -</a>
              <a href="/#skills" className="home-id">Skills -</a>
              <a href="/#testimonials" className="home-id">Testimonials -</a>
              <a href="/#personal-links" className="home-id">Hot Links -</a>
              <a href="/#contact" className="home-id">Contact -</a>
          </div>

          <NavLink
            to="/blog"
            className="nav-link"
          >
            <div className="link-wrapper">
              <div className="link-content">Blog</div>
            </div>
          </NavLink>

          {userLoggedIn ? (
            <NavLink
              to="/testify"
              className="nav-link"
            >
              <div className="hidden-link">
                <div className="link-content">Testify</div>
              </div>
            </NavLink>
            ) : null}

          {adminLoggedIn ? (
            <NavLink
              to="/manager"
              className="nav-link"
            >
            <div className="hidden-link">
              <div className="link-content">Manager</div>
            </div>
            </NavLink>
          ) : (null)}

            <div className="resume-loader">- Resume -</div>

            <div className="switch-wrapper">
              <div className="switch-title">Light Mode</div>
              <label className="switch">
                <input onClick={ handleTheme } type="checkbox" />
                <span className="slider" />
              </label>
              <div className="switch-title">Dark Mode</div>
            </div>

            {adminLoggedIn || userLoggedIn ? (
              <div className="log-btn">
                <NavLink to="/" className="log" onClick={ handleSignOut }>
                  Sign-out
                </NavLink>
              </div>
            ) : (
              <div className="log-btn">
                <NavLink to="/log" className="log">
                  Sign-in
                </NavLink>
              </div>
            )}

        </div>
      </div>
    </>
  );
};

export default Navbar;
