import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../../context.js";
import Climbing from "../../../static/personal-pictures/alan-lead-climbing-jtree.png";

const CreateAdminUser = () => {
  const { setLoggedIn, directory } = useAppContext();

  let navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [pw, setPW] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (newChange) => {
    newChange.preventDefault();
    const gmailVerification = '@gmail.com';
    
    if (!email.includes(gmailVerification)) {
      setError(true);
      setErrorMessage("Error: must be a G-mail account to be an admin");
    } else {
      if (pw !== confirmPW) {
        setError(true);
        setErrorMessage("Error: The passwords must match");
      } else {
        fetch(`${directory}/admin/add`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: username,
            email: email,
            pw: pw,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res === "Error: The user is already registered.") {
              setError(true);
              setErrorMessage("Error: The user is already registered.");
            } else {
              setError(false);
              setErrorMessage("");
              setLoggedIn("ADMIN");
              setError(true);
              setErrorMessage("Admin account has been successfully created");
              navigate("/");
            }
          })
          .catch((error) => {
            console.log("Error with creating an account", error);
            setError(true);
            setErrorMessage("Error setting up your account, please try again!");
          });
      }
    }
  };

  return (
    <>
      <div className="page-elements-wrapper">
        <h1>Create Admin</h1>

        <div className="create-admin-wrapper">
          <div className="creater-wrapper">
            <form
              className="create-user"
              onSubmit={(newChange) => handleSubmit(newChange)}
            >
              <input
                type="username"
                name="username"
                value={username}
                placeholder="User's name"
                onChange={(newChange) => setUserName(newChange.target.value)}
              />

              <input
                type="email"
                name="email"
                value={email}
                placeholder="Google Email *gmail.com only*"
                onChange={(newChange) => setEmail(newChange.target.value)}
              />

              <input
                type="password"
                name="pw"
                value={pw}
                placeholder="Password"
                onChange={(newChange) => setPW(newChange.target.value)}
              />

              <input
                type="password"
                name="confirmPW"
                value={confirmPW}
                placeholder="Confirm Password"
                onChange={(newChange) => setConfirmPW(newChange.target.value)}
              />

              <button className="confirm-btn" type="submit">
                Create User
              </button>

              <div
                className="errorMessage"
                style={{ visibility: error ? "visible" : "hidden" }}
              >
                {errorMessage}
              </div>
            </form>
          </div>
          <div className="image-wrapper">
            <div
              className="image"
              style={{
                background: "url(" + Climbing + ") no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminUser;
