import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../../context.js";
import Login from "../../../static/personal-pictures/alan-bouldering-the-finger-jtree.png";

const Log = () => {
  const {
    setLoggedIn,
    directory,
    setEmail,
    email,
    setPW,
    pw,
    setError,
    error,
    setErrorMessage,
    errorMessage,
    setUser_id,
    setAdminAuth
  } = useAppContext();

  let navigate = useNavigate();

  const handleSubmit = (newChange) => {
    newChange.preventDefault();

    if (email === "" || pw === "") {
      setError(true);
      setErrorMessage("Error: All fields must be completed");
    } else {
      fetch(`${directory}/log/verify/admin`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          'Admin_Authorization': `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          email: email,
          pw: pw,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res === "Admin is NOT verified") {
            fetch(`${directory}/log/verify/user`, {
              method: "POST",
              headers: {
                'content-type': 'application/json',
                'User_Authorization': `Bearer ${localStorage.getItem("user_token")}`,
              },
              body: JSON.stringify({
                email: email,
                pw: pw,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res === "User is NOT verified") {
                  setError(true);
                  setErrorMessage("Error: Account could not be verified");
                } else {
                  setError(false);
                  setErrorMessage("");
                  setLoggedIn(`${res.user_logged_in}`);
                  setUser_id(res.user_id);
                  localStorage.setItem("user_token", res.user_token);
                  navigate("/");
                }
              })
              .catch((error) => {
                console.log("Error with logging in, please try again.", error);
                setError(true);
                setErrorMessage("Error with logging in, please try again.");
              });
          } else {
            setError(false);
            setErrorMessage("");
            setLoggedIn(`${res.admin_logged_in}`);
            setAdminAuth(`${res.admin_auth_id}`);
            localStorage.setItem("admin_token", res.admin_token);
            navigate("/");
          }
        })
        .catch((error) => {
          console.log("Error with logging in, please try again.", error);
          setError(true);
          setErrorMessage("Error with logging in, please try again.");
        });
    }
  };

  useEffect(() => {
    setError(false);
    setErrorMessage("");
  });

  return (
    <>
      <div className="page-elements-wrapper">
        <h1>Log-in Page</h1>
        <div className="log">
          <div
            className="left-column"
            style={{
              background: "url(" + Login + ") no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "10% 10%",
            }}
          />

          <form
            className="right-column"
            onSubmit={(newChange) => handleSubmit(newChange)}
          >
            <div className="user-name-wrapper">
              <input
                type="text"
                name="email"
                value={email}
                placeholder="User Name"
                onChange={(newChange) => setEmail(newChange.target.value)}
              />
            </div>

            <div className="password-wrapper">
              <input
                type="password"
                name="pw"
                placeholder="Password"
                onChange={(newChange) => setPW(newChange.target.value)}
              />
            </div>

            <button className="log-btn" type="submit">
              Log-in
            </button>

            <div
              className="errorMessage"
              style={{ visibility: error ? "visible" : "hidden" }}
            >
              {errorMessage}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Log;
