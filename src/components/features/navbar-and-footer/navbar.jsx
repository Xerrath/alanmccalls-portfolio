import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [changeIcon, setChangeIcon] = useState(true);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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

  function homeHash(classID) {
    navigate(`/#${classID}`);
  }

  function homeRedirect(classID) {
    navigate("/");
    homeHash(classID)
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
              <div className="home-id" onClick={() => homeRedirect('about')}>About -</div>
              <div className="home-id" onClick={() => homeRedirect('mission')}>Mission -</div>
              <div className="home-id" onClick={() => homeRedirect('projects')}>Projects -</div>
              <div className="home-id" onClick={() => homeRedirect('skills')}>Skills -</div>
              <div className="home-id" onClick={() => homeRedirect('testimonials')}>Testimonials -</div>
              <div className="home-id" onClick={() => homeRedirect('personal-links')}>Hot Links -</div>
              <div className="home-id" onClick={() => homeRedirect('contact')}>Contact -</div>
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
            
            <a href="https://docs.google.com/document/d/1daCxJ6dtRtx1JZ8Y7qw95MgPuJ-yB36J/edit?usp=sharing&ouid=104423727445222038479&rtpof=true&sd=true"
              target="_blank"
              rel="noreferrer"
            >
              <div className="resume-loader">- Resume -</div>
            </a>

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
