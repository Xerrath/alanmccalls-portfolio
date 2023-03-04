import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Blog from "./components/pages/basic-pages/blog.jsx";
import BlogDetails from "./components/pages/basic-pages/blog-details.jsx";
import CreateAdminUser from "./components/pages/basic-pages/create-admin-user.jsx";
import Manager from "./components/pages/admin-pages/manager.jsx";
import Footer from "./components/features/navbar-and-footer/footer.jsx";
import Home from "./components/pages/basic-pages/home.jsx";
import Log from "./components/pages/basic-pages/log.jsx";
import Navbar from "./components/features/navbar-and-footer/navbar.jsx";
import NoMatch from "./components/pages/basic-pages/no-match.jsx";
import Testify from "./components/pages/user-pages/testify.jsx";

import { useAppContext } from "./context.js";
import "./styles/main.scss";

function App() {
  const { theme, navSize, adminLoggedIn, userLoggedIn } = useAppContext();

  return (
    <div className="App">
      <BrowserRouter>
        <div className={theme} id="level-one">
          <div className={navSize} id="level-two">
            <Navbar />

            <div className="page-contents" id="level-three">
              <Routes>
                {/* GUESTS Links */}
                <Route exact path="/" element={<Home />} />
                <Route exact path="/blog" element={<Blog />} />
                <Route exact path="/blog/details/:blogId" element={<BlogDetails />} />
                <Route exact path="/log" element={<Log />} />
                <Route exact path="/create-admin-user" element={<CreateAdminUser />} />

                {/* USERS Links */}
                {userLoggedIn ? (
                  <>
                    <Route exact path="/testify" element={<Testify />} />
                  </>
                ) : null}

                {/* ADMINS Links */}
                {adminLoggedIn ? (
                  <>
                    <Route exact path="/manager" element={<Manager />} />
                  </>
                ) : null}

                {/* Default Error Page */}
                <Route exact path="*" element={<NoMatch />} />
              </Routes>
              
              <Footer />
              
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
