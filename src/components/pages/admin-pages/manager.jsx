import React, { useState } from 'react';
// import { useAppContext } from '../../../context';

import BlogManager from '../../features/manager-page-features/blog-manager.jsx';
import ProjectsManager from '../../features/manager-page-features/project-manager.jsx';
import TestimonialsManager from '../../features/manager-page-features/testimonial-manager.jsx';
import UsersManager from '../../features/manager-page-features/user-manager.jsx';
// import AdminsManager from '../../features/manager-page-features/admins-manager.jsx';

const Manager = () => {
  // const { adminAuth } = useAppContext();

  // const [parentAdmin, setParentAdmin] = useState(false);
  const [renderAElement, setAElement] = useState(true);
  const [renderBlogManager, setBlogManager] = useState(false);
  const [renderProjectsManager, setProjectsManager] = useState(false);
  const [renderTestimonialsManager, setTestimonialsManager] = useState(false);
  // const [renderAdminsManager, setAdminsManager] = useState(false);
  const [renderUsersManager, setUsersManager] = useState(false);


  // This will be set up when I need more admins
  // useEffect(() => {
  //   if (adminAuth === "1") {
  //     setParentAdmin(true);
  //   } else {
  //     setParentAdmin(false);
  //   }
  // },[adminAuth])

  function handleBlogClick() {
    if (renderBlogManager === false) {
      setBlogManager(true);
      setProjectsManager(false);
      setTestimonialsManager(false);
      setUsersManager(false);
      // setAdminsManager(false);
      setAElement(false);
    } else if (renderBlogManager === true) {
      setBlogManager(false);
      setAElement(true);
    }
  }

  function handleProjectsClick() {
    if (renderProjectsManager === false) {
      setBlogManager(false);
      setProjectsManager(true);
      setTestimonialsManager(false);
      setUsersManager(false);
      // setAdminsManager(false);
      setAElement(false);
    } else if (renderProjectsManager === true) {
      setProjectsManager(false);
      setAElement(true);
    }
  }

  function handleTestimonialsClick() {
    if (renderTestimonialsManager === false) {
      setBlogManager(false);
      setProjectsManager(false);
      setTestimonialsManager(true);
      setUsersManager(false);
      // setAdminsManager(false);
      setAElement(false);
    } else if (renderTestimonialsManager === true) {
      setTestimonialsManager(false);
      setAElement(true);
    }
  }

  function handleUsersClick() {
    if (renderUsersManager === false) {
      setBlogManager(false);
      setProjectsManager(false);
      setTestimonialsManager(false);
      setUsersManager(true);
      // setAdminsManager(false);
      setAElement(false);
    } else if (renderUsersManager === true) {
      setUsersManager(false);
      setAElement(true);
    }
  }

  // function handleAdminsClick() {
  //   if (renderUsersManager === false) {
  //     setBlogManager(false);
  //     setProjectsManager(false);
  //     setTestimonialsManager(false);
  //     setUsersManager(false);
  //     setAdminsManager(true);
  //     setAElement(false);
  //   } else if (renderUsersManager === true) {
  //     setAdminsManager(false);
  //     setAElement(true);
  //   }
  // }

  return (
    <>
      <div className="page-elements-wrapper">
        <h1>Manager</h1>

        <div className='manager-container-wrapper'>
          <div className='manager-navbar'>
            <div className='manager-link' onClick={ handleBlogClick }>Blogs</div>
            <div className='manager-link' onClick={ handleProjectsClick }>Projects</div>
            <div className='manager-link' onClick={ handleTestimonialsClick }>Testimonials</div>
            <div className='manager-link' onClick={ handleUsersClick }>Users</div>
            {/* {parentAdmin ? (
              <div className='manager-link' onClick={ handleAdminsClick }>Admins</div>
            ): (null)} */}
          </div>

          <div className='render-manager-element'>
            {
              renderAElement ? (
                <>
                  <div className='manager-element' style={{justifyContent: 'center'}}>Please Select A Manager</div>
                </>
                ) : (
                  <>
                    {
                      renderBlogManager ? (
                        <BlogManager />
                      ) : (null)
                    }
                    {
                      renderProjectsManager ? (
                        <ProjectsManager />
                      ) : (null)
                    }
                    {
                      renderTestimonialsManager ? (
                        <TestimonialsManager />
                      ) : (null)
                    }
                    {
                      renderUsersManager ? (
                        <UsersManager />
                      ) : (null)
                    }
                    {/* {
                      renderAdminsManager && parentAdmin ? (
                        <AdminsManager />
                      ) : (null)
                    } */}
                  </>
                )
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default Manager