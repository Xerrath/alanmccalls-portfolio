import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";

import { useAppContext } from "../../../context.js";

const Footer = () => {
  const navigate = useNavigate();
  const {
    setLoggedIn,
    adminLoggedIn,
    userLoggedIn,
  } = useAppContext();

  function handleSignOut() {
    setLoggedIn("GUEST");
    localStorage.setItem("admin_token", null);
    localStorage.setItem("user_token", null);
    navigate("/");
  }

  return (
    <>
      <div className="footer-wrapper">
        <div className="footer-text">Last Updated in 2023</div>
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
    </>
  )
}

export default Footer