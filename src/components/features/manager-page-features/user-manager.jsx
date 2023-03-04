import React, { useState, useEffect } from "react";

import { useAppContext } from "../../../context.js";

const UserManager = () => {
  const { adminLoggedIn, loggedIn, directory, adminAuth } =
    useAppContext();

  const [username, setUserName] = useState("");
  const [pw, setPW] = useState("");
  const [email, setEmail] = useState("");
  const [URL, setURL] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const [editorMode, setEditorMode] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userChangeDetected, setUserChangeDetected] = useState(false);

  // All Users
  const [allUsers, setAllUsers] = useState([]);

  // User Search
  const [searchInput, setSearchInput] = useState("");

  // single user and their data
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const [updateUserName, setUpdateUserName] = useState("");
  const [updateUserEmail, setUpdateUserEmail] = useState("");
  const [updateUserURL, setUpdateUserURL] = useState("");
  const [updateUserPW, setUpdateUserPW] = useState("");
  const [updateConfirmPW, setUpdateConfirmPW] = useState("");

  // scroll animation variables
  let elementHeight = 416;
  let [yOffset, setYOffset] = useState(0);
  let totalElementsShown = Math.floor(elementHeight / 156);
  let elementsWithin = (allUsers.length - totalElementsShown) * 156;

  const handleSubmit = (newChange) => {
    newChange.preventDefault();

    if (loggedIn === "ADMIN" && adminLoggedIn === true) {
      if (pw !== confirmPW) {
        setError(true);
        setErrorMessage("Error: The passwords must match");
      } else {
        fetch(`${directory}/user/add`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: email,
            pw: pw,
            username: username,
            url: URL,
            adminAuth: adminAuth,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res === "Error: The user is already registered.") {
              setError(true);
              setErrorMessage("Error: The user is already registered.");
            } else {
              setError(true);
              setErrorMessage("User has been successfully created");
              setUserName("");
              setPW("");
              setEmail("");
              setURL("");
              setConfirmPW("");
              setUserChangeDetected(true);
            }
          })
          .catch((error) => {
            console.log("Error with creating an account", error);
            setError(true);
            setErrorMessage("Error setting up your account, please try again!");
          });
      }
    } else {
      setError(true);
      setErrorMessage(
        "Error setting up user account, You must be a ADMIN to create a user!"
      );
    }
  };

  useEffect(() => {
    setError(false);
    setErrorMessage("");
    
    if (adminAuth === "1") {
      const grabAllUsers = async () => {
        try {
          const response = await fetch(`${directory}/users`);
          const data = await response.json();
          setAllUsers(data);
        } catch (error) {
          console.error(error);
        }
      };
      grabAllUsers();
    } else {
      const grabAllUsersByRelation = async () => {
        try {
          const response = await fetch(
            `${directory}/get/all/users/${adminAuth}`
          );
          const data = await response.json();
          setAllUsers(data);
        } catch (error) {
          console.error(error);
        }
      };
      grabAllUsersByRelation();
    }

    setUserChangeDetected(false);
  }, [ adminAuth, directory, userChangeDetected]);

  useEffect(() => {
    function handleResize() {
      setYOffset(0);
      let totalElementsShown = Math.floor(elementHeight / 156);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    setUserId(userData.user_id);
    setUpdateUserName(userData.user_name);
    setUpdateUserEmail(userData.user_email);
    setUpdateUserURL(userData.user_url);
  }, [userData]);

  function moveSliderUp() {
    if (yOffset > -elementsWithin) {
      setYOffset((yTranslate) => yTranslate - totalElementsShown * 156);
    } else {
      setYOffset((yTranslate) => (yTranslate = 0));
    }
  }

  function moveSliderdown() {
    if (yOffset < 0) {
      setYOffset((yTranslate) => yTranslate + totalElementsShown * 156);
    } else if (yOffset > 0) {
      setYOffset((yTranslate) => (yTranslate = 0));
    }
  }

  const handleSearchChange = event => {
    setSearchInput(event.target.value);
  };

  const handleUserEdit = async (id) => {
    try {
      const response = await fetch(`${directory}/users/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setUserData(data);
      setError(true);
      setErrorMessage(`User ${data.user_name} has been selected for edit!`);
    } catch (error) {
      console.error(error);
    }
    setEditorMode(true);
  };

  function handleCancelEdit() {
    setEditorMode(false);
    setError(true);
    setErrorMessage("Editing this user was canceled");
  }

  function handleUpdatedSubmit(updated) {
    updated.preventDefault();

    if (loggedIn === "ADMIN" && adminLoggedIn === true) {
      if (updateUserPW !== updateConfirmPW && updateUserPW === "") {
        setError(true);
        setErrorMessage("Error: The passwords must match");
      } else {
        fetch(`${directory}/users/edit/${userId}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            updated_email: updateUserEmail,
            updated_pw: updateUserPW,
            updated_username: updateUserName,
            updated_url: updateUserURL,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res === "Error: The user email is already in use.") {
              setError(true);
              setErrorMessage("Error: The user email is already in use.");
            } else if (res === "User was not found.") {
              setError(true);
              setErrorMessage("User was not found.");
            } else {
              setError(true);
              setErrorMessage("User has been successfully Edited");
              setUserName("");
              setPW("");
              setEmail("");
              setURL("");
              setConfirmPW("");
              setUserChangeDetected(true);
            }
          })
          .catch((error) => {
            console.log("Error with editing user account", error);
            setError(true);
            setErrorMessage("Error editing user account, please try again!");
          });
      }
    } else {
      setError(true);
      setErrorMessage(
        "Error setting up user account, You must be a ADMIN to edit a user!"
      );
    }
  }

  const handleUserDelete = async (id) => {
    try {
      const response = await fetch(`${directory}/users/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data === 'The selected user has been deleted') {
        setError(true);
        setErrorMessage("User has been successfully deleted!");
      }
    } catch (error) {
      console.error(error);
    }

    setUserChangeDetected(true);
  };

  const displayUsers = allUsers.map((allUsers, index) => {
    let mappedUserName = allUsers.user_name.toLowerCase();
    let mappedUserEmail = allUsers.user_email.toLowerCase();

    if (mappedUserName.includes(searchInput.toLowerCase()) || mappedUserEmail.includes(searchInput.toLowerCase())) {
      return (
        <div className="user-wrapper" key={`${allUsers.user_name} + ${index}`}>
          <div className="user-name"> {allUsers.user_name} </div>
          <div className="user-email"> {allUsers.user_email} </div>
          <div className="user-options">
            <div
              className="user-edit"
              onClick={() => handleUserEdit(allUsers.user_id)}
            >
              &#9472; Edit &#9472;
            </div>
            <div
              className="user-delete"
              onClick={() => handleUserDelete(allUsers.user_id)}
            >
              &#9472; Delete &#9472;
            </div>
          </div>
        </div>
      );
    } else if (searchInput === "") {
      return (
        <div className="user-wrapper" key={`${allUsers.user_name} + ${index}`}>
          <div className="user-name"> {allUsers.user_name} </div>
          <div className="user-email"> {allUsers.user_email} </div>
          <div className="user-options">
            <div
              className="user-edit"
              onClick={() => handleUserEdit(allUsers.user_id)}
            >
              &#9472; Edit &#9472;
            </div>
            <div
              className="user-delete"
              onClick={() => handleUserDelete(allUsers.user_id)}
            >
              &#9472; Delete &#9472;
            </div>
          </div>
        </div>
      );
    } else {
      return (null);
    }
  });

  const displayUserEdit = () => {
    return (
      <>
        <form
          className="edit-user"
          onSubmit={(update) => handleUpdatedSubmit(update)}
        >
          <input
            type="name"
            name="username"
            value={updateUserName}
            placeholder="User's name"
            onChange={(updateUserName) =>
              setUpdateUserName(updateUserName.target.value)
            }
          />

          <input
            type="email"
            name="email"
            value={updateUserEmail}
            placeholder="User's email"
            onChange={(updateUserEmail) =>
              setUpdateUserEmail(updateUserEmail.target.value)
            }
          />

          <input
            type="url"
            name="URL"
            value={updateUserURL}
            placeholder="User's URL"
            onChange={(updateUserURL) =>
              setUpdateUserURL(updateUserURL.target.value)
            }
          />

          <div className="password-wrapper">
            <input
              type="password"
              name="pw"
              value={updateUserPW}
              placeholder="Password"
              onChange={(updateUserPW) =>
                setUpdateUserPW(updateUserPW.target.value)
              }
            />

            <input
              type="password"
              name="confirmPW"
              value={updateConfirmPW}
              placeholder="Confirm Password"
              onChange={(updateConfirmPW) =>
                setUpdateConfirmPW(updateConfirmPW.target.value)
              }
            />
          </div>

          <div className="button-wrapper">
            <button className="confirm-btn" type="submit">
              Submit Edits
            </button>
            <div className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </div>
          </div>

          <div
            className="errorMessage"
            style={{ visibility: error ? "visible" : "hidden" }}
          >
            {errorMessage}
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      <div className="manager-element">
        <div className="manager-header">User Creater Manager</div>

        <div className="users-manager-wrapper">
          <div className="left-column">
            <div className="users-display-wrapper">
              <input type="search" name="search" placeholder="search" onChange={ handleSearchChange } />

              <div className="current-users-wrapper">
                <div className="button-handles-wrapper">
                  <div onClick={moveSliderdown} className="left-slider slider">
                    &#9651;
                  </div>
                  <div onClick={moveSliderUp} className="right-slider slider">
                    &#9661;
                  </div>
                </div>

                <div className="current-users-hider-wrapper">
                  <div
                    style={{ transform: `translateY(${yOffset}px)` }}
                    className="current-users"
                  >
                    
                    {userChangeDetected ? (
                      <div className="loading-or-error">Loading...</div>
                    ) : (
                      displayUsers
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            {editorMode ? (
              displayUserEdit()
            ) : (
              <>
                <form
                  className="create-user"
                  onSubmit={(newChange) => handleSubmit(newChange)}
                >
                  <input
                    type="name"
                    name="username"
                    value={username}
                    placeholder="User's name"
                    onChange={(newChange) =>
                      setUserName(newChange.target.value)
                    }
                  />

                  <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="User's email"
                    onChange={(newChange) => setEmail(newChange.target.value)}
                  />

                  <input
                    type="text"
                    name="URL"
                    value={URL}
                    placeholder="User's URL"
                    onChange={(newChange) => setURL(newChange.target.value)}
                  />

                  <div className="password-wrapper">
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
                      onChange={(newChange) =>
                        setConfirmPW(newChange.target.value)
                      }
                    />
                  </div>

                  <button className="confirm-btn" type="submit">
                    Add User
                  </button>

                  <div
                    className="errorMessage"
                    style={{ visibility: error ? "visible" : "hidden" }}
                  >
                    {errorMessage}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManager;