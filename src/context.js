import React, { createContext, useContext, useState, useEffect } from  'react';

const AppContext = createContext();

export default function AppWrapper({children}) {
    // --------------------------------
    // States
    // --------------------------------
    const [email, setEmail] = useState("");
    const [pw, setPW] = useState("");
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [themeSwitch, setThemeSwitch] = useState(false);
    const [theme, setTheme] = useState('LightMode');
    const [navCollapsed, setNavCollapsed] = useState(true);
    const [navSize, setNavSize] = useState('Small-Nav');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(`GUEST`);
    const [user_id, setUser_id] = useState("");
    const [adminAuth, setAdminAuth] = useState("");
    const [projectsChangeDetected, setProjectsChangeDetected] = useState(false);
    const [blogChangesDetected, setBlogChangesDetected] = useState(false);

    // --------------------------------
    // Variables
    // --------------------------------
    
    // const directory = `http://127.0.0.1:5000`;
    const directory = `https://alans-custom-backend.herokuapp.com/`;

    // --------------------------------
    // custom functions
    // --------------------------------

    function handlewhoIsLoggedIn(loggedIn) {
        if (loggedIn === 'ADMIN') {
            setAdminLoggedIn(true);
            setUserLoggedIn(false);
        } else if (loggedIn === 'USER') {
            setAdminLoggedIn(false);
            setUserLoggedIn(true);
        } else {
            setAdminLoggedIn(false);
            setUserLoggedIn(false);
        }
    }

    function handleThemeChange(themeSwitch) {
        if (themeSwitch === false) {
            setTheme('LightMode');
        } else if (themeSwitch === true) {
            setTheme('DarkMode');
        } else {
            setTheme('LightMode');
            setThemeSwitch(false);
        }
    }

    function handleNavSize(navCollapsed) {
        if (navCollapsed === true) {
            setNavSize('Small-Nav');
        } else if (navCollapsed === false) {
            setNavSize('Large-Nav');
        }
    }

    // --------------------------------
    // Function Listeners
    // --------------------------------

    useEffect(() => {
        const admin_token = localStorage.getItem("admin_token");

        if (admin_token) {
            fetch(`${directory}/log/verify/admin`, {
                method: "POST",
                headers: { 'content-type': 'application/json', 'Admin_Authorization': `Bearer ${localStorage.getItem("admin_token")}`},
                body: JSON.stringify({
                  email: email
                }), 
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.data.email !== "") {
                    setError(false);
                    setErrorMessage("");
                    setLoggedIn(`${res.admin_logged_in}`);
                    setAdminAuth(`${res.admin_auth_id}`);
                }
                setError(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setError(true);
                setErrorMessage("Error with logging in, please try again.");
            })
        }
    }, [])

    useEffect(() => {
        const user_token = localStorage.getItem("user_token");

        if (user_token) {
            fetch(`${directory}/log/verify/user`, {
                method: "POST",
                headers: { 'content-type': 'application/json', 'User_Authorization': `Bearer ${localStorage.getItem("user_token")}`},
                body: JSON.stringify({
                  email: email
                }), 
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.data.email !== "") {
                    setError(false);
                    setErrorMessage("");
                    setLoggedIn(`${res.user_logged_in}`);
                    setUser_id(res.user_id);
                }
                setError(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setError(true);
                setErrorMessage("Error with logging in, please try again.");
            })
        }
    }, [])

    useEffect(() => {
        handlewhoIsLoggedIn(loggedIn);
    }, [loggedIn]);

    useEffect(() => {
        handleThemeChange(themeSwitch);
    }, [themeSwitch]);

    useEffect(() => {
        handleNavSize(navCollapsed);
    },[navCollapsed]);

    // --------------------------------
    // Shared Exports
    // --------------------------------

    let sharedState = {

        // --------------------------------
        // Shared Function Exports
        // --------------------------------

        setLoggedIn: value => setLoggedIn(value),
        setThemeSwitch: value => setThemeSwitch(value),
        setNavCollapsed: value => setNavCollapsed(value),
        setNavSize: value => setNavSize(value),
        setUser_id: value => setUser_id(value),
        setEmail: value => setEmail(value),
        setPW: value => setPW(value),
        setError: value => setError(value),
        setErrorMessage: value => setErrorMessage(value),
        setProjectsChangeDetected: value => setProjectsChangeDetected(value),
        setAdminAuth: value => setAdminAuth(value),
        setBlogChangesDetected: value => setBlogChangesDetected(value),


        // --------------------------------
        // Shared Variable Exports
        // --------------------------------

        directory: directory,
        adminAuth: adminAuth,
        adminLoggedIn: adminLoggedIn,
        userLoggedIn: userLoggedIn,
        themeSwitch: themeSwitch,
        theme: theme,
        navSize: navSize,
        loggedIn: loggedIn,
        navCollapsed: navCollapsed,
        user_id: user_id,
        email: email,
        pw: pw,
        error: error,
        errorMessage: errorMessage,
        projectsChangeDetected: projectsChangeDetected,
        blogChangesDetected: blogChangesDetected,
    }

    return <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
}

export function useAppContext() {
    return useContext(AppContext)
}