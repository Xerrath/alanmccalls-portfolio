import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Buffer } from "buffer";

import { useAppContext } from "../../../context.js";

import ProjectsForm from "./manager-features/projects-form-feature.jsx";

const ProjectManager = () => {
  const {
    directory,
    adminAuth,
    projectsChangeDetected,
    setProjectsChangeDetected,
    setError,
    error,
    setErrorMessage,
    errorMessage,
  } = useAppContext();
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { FileReader } = window;
  const [projectData, setProjectData] = useState([]);
  const [editorMode, setEditorMode] = useState(false);
  const [id, setId] = useState();

  const [rawCalledThumbImg, setRawCalledThumbImg] = useState(null);
  const [rawCalledLogoImg, setRawCalledLogoImg] = useState(null);
  const [rawCalledHeroImg, setRawCalledHeroImg] = useState(null);
  const [rawHeroImage, setRawHeroImage] = useState(null);
  const [rawThumbImage, setRawThumbImage] = useState(null);
  const [rawLogoImage, setRawLogoImage] = useState(null);
  const [heroImageDropped, setHeroImageDropped] = useState(null);
  const [thumbImageDropped, setThumbImageDropped] = useState(null);
  const [logoImageDropped, setLogoImageDropped] = useState(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectLanguage, setProjectLanguage] = useState("");
  const [projectDevelopmentType, setProjectDevelopmentType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectURL, setProjectURL] = useState("");

  let elementHeight = 420;
  let [yOffset, setYOffset] = useState(0);
  let totalElementsShown = Math.floor(elementHeight / 201);
  let elementsWithin = (allProjectsData.length - totalElementsShown) * 200;

  useEffect(() => {
    setError(false);
    setErrorMessage("");

    if (adminAuth === "1") {
      const grabAllProjects = async () => {
        try {
          const response = await fetch(`${directory}/get/projects`);
          const data = await response.json();
          setAllProjectsData(data);
        } catch (error) {
          console.log(error);
        }
      };
      grabAllProjects();
    } else {
      const grabAllProjects = async () => {
        try {
          const response = await fetch(
            `${directory}/get/projects/by/${adminAuth}`
          );
          const data = await response.json();
          setAllProjectsData(data);
        } catch (error) {
          console.log(error);
        }
      };
      grabAllProjects();
    }

    setProjectsChangeDetected(false);
  }, [projectsChangeDetected]);

  useEffect(() => {
    function handleResize() {
      setYOffset(0);
      let totalElementsShown = Math.floor(elementHeight / 200);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  function moveSliderUp() {
    if (yOffset > -elementsWithin) {
      setYOffset((yTranslate) => yTranslate - totalElementsShown * 200);
    } else {
      setYOffset((yTranslate) => (yTranslate = 0));
    }
  }

  function moveSliderdown() {
    if (yOffset < 0) {
      setYOffset((yTranslate) => yTranslate + totalElementsShown * 200);
    } else if (yOffset > 0) {
      setYOffset((yTranslate) => (yTranslate = 0));
    }
  }

  const handleSearchChange = (event) => {
    let search = event.target.value.toLowerCase();
    setSearchInput(search);
  };

  const handleProjectDelete = async (id) => {
    try {
      const response = await fetch(`${directory}/project/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data === "The selected project has been deleted") {
        setError(true);
        setErrorMessage("Project has been successfully deleted!");
      }
    } catch (error) {
      console.error(error);
    }

    setProjectsChangeDetected(true);
  };

  function updateThumbImage(rawCalledThumbImg) {
    const thumbImgStr = String(rawCalledThumbImg);
    const thumbImgBuffered = Buffer.from(thumbImgStr, 'base64');
    const thumbImgByte = new Uint8Array(thumbImgBuffered);
    const thumbImgBlob = new Blob([thumbImgByte], {type: 'image/jpeg,image/png,image/svg+xml'});
    const thumbImgFile = new File([thumbImgBlob], `${id}image.jpg`, {type: 'image/jpeg'});

    handleUpdateThumbImageDrop([thumbImgFile]);
  }

  function updateLogoImage(rawCalledLogoImg) {
    const logoImgStr = String(rawCalledLogoImg);
    const logoImgBuffered = Buffer.from(logoImgStr, 'base64');
    const logoImgByte = new Uint8Array(logoImgBuffered);
    const logoImgBlob = new Blob([logoImgByte], {type: 'image/jpeg,image/png,image/svg+xml'});
    const logoImgFile = new File([logoImgBlob], `${id}image.jpg`, {type: 'image/jpeg'});

    handleUpdateLogoImageDrop([logoImgFile]);
  }

  function updateHeroImage(rawCalledHeroImg) {
    const heroImgStr = String(rawCalledHeroImg);
    const heroImgBuffered = Buffer.from(heroImgStr, 'base64');
    const heroImgByte = new Uint8Array(heroImgBuffered);
    const heroImgBlob = new Blob([heroImgByte], {type: 'image/jpeg,image/png,image/svg+xml'});
    const heroImgFile = new File([heroImgBlob], `${id}image.jpg`, {type: 'image/jpeg'});

    handleUpdateHeroImageDrop([heroImgFile]);
  }

  useEffect(() => {
    if (editorMode === true) {
      setId(projectData.project_id);
      setRawCalledThumbImg(projectData.project_thumb_img);
      setRawCalledLogoImg(projectData.project_logo_img);
      setRawCalledHeroImg(projectData.project_hero_img);
      setProjectTitle(projectData.project_title);
      setProjectLanguage(projectData.project_language);
      setProjectDevelopmentType(projectData.project_development_type);
      setProjectDescription(projectData.project_description);
      setProjectURL(projectData.project_url);
    } else if (editorMode === false) {
      setId();
      setRawCalledThumbImg();
      setRawCalledLogoImg();
      setRawCalledHeroImg();
      setProjectTitle("");
      setProjectLanguage("");
      setProjectDevelopmentType("");
      setProjectDescription("");
      setProjectURL("");
    }

    updateThumbImage(rawCalledThumbImg);
    updateLogoImage(rawCalledLogoImg);
    updateHeroImage(rawCalledHeroImg);
  }, [editorMode, projectData, rawCalledHeroImg, rawCalledLogoImg, rawCalledThumbImg]);

  const handleProjectEdit = async (id) => {
    try {
      const response = await fetch(`${directory}/project/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setProjectData(data);
      setError(true);
      setErrorMessage(`Project ${data.project_title} has been selected for edit!`);
    } catch (error) {
      console.error(error);
    }

    setEditorMode(true);
  };

  function handleEditModeCancel() {
    setEditorMode(false);
    setError(true);
    setErrorMessage("Editing this project has been Canceled");
    setRawCalledThumbImg(null);
    setRawCalledLogoImg(null);
    setRawCalledHeroImg(null);
    setRawHeroImage(null);
    setRawThumbImage(null);
    setRawLogoImage(null);
    setHeroImageDropped(null);
    setThumbImageDropped(null);
    setLogoImageDropped(null);
    setProjectTitle("");
    setProjectLanguage("");
    setProjectDevelopmentType("");
    setProjectDescription("");
    setProjectURL("");
  };

  function handleSubmitEdit(newChange) {
    newChange.preventDefault();

    fetch(`${directory}/project/edit/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        updated_title: projectTitle,
        updated_language: projectLanguage,
        updated_development_type: projectDevelopmentType,
        updated_description: projectDescription,
        updated_url: projectURL,
        updated_hero_img: rawHeroImage ? Array.from(rawHeroImage): null,
        updated_thumb_img: rawThumbImage ? Array.from(rawThumbImage): null,
        updated_logo_img: rawLogoImage ? Array.from(rawLogoImage): null
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res === "Project was not found.") {
          setError(true);
          setErrorMessage("Project was not found.");
        } else {
          setError(true);
          setErrorMessage("Project has been successfully Edited");
          setRawCalledThumbImg(null);
          setRawCalledLogoImg(null);
          setRawCalledHeroImg(null);
          setRawHeroImage(null);
          setRawThumbImage(null);
          setRawLogoImage(null);
          setHeroImageDropped(null);
          setThumbImageDropped(null);
          setLogoImageDropped(null);
          setProjectTitle("");
          setProjectLanguage("");
          setProjectDevelopmentType("");
          setProjectDescription("");
          setProjectURL("");
          setProjectsChangeDetected(true);
          setEditorMode(false);
        }
      })
      .catch((error) => {
        console.log("Error with editing project", error);
        setError(true);
        setErrorMessage("Error editing project, please try again!");
      });
  }

  const handleUpdateThumbImageDrop = (acceptedFiles) => {
    setThumbImageDropped(null);
    setThumbImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawThumbImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  const handleUpdateLogoImageDrop = (acceptedFiles) => {
    setLogoImageDropped(null);
    setLogoImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawLogoImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  const handleUpdateHeroImageDrop = (acceptedFiles) => {
    setHeroImageDropped(null);
    setHeroImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawHeroImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  const allProjectsRender = allProjectsData.map((allProjectsData, index) => {
    let mappedProjectTitle = allProjectsData.project_title.toLowerCase();
    let mappedProjectDevelopmentType =
      allProjectsData.project_development_type.toLowerCase();
    let mappedProjectLanguage = allProjectsData.project_language.toLowerCase();
    let mappedProjectURL = allProjectsData.project_url.toLowerCase();

    if (
      mappedProjectTitle.includes(searchInput.toLowerCase()) ||
      mappedProjectDevelopmentType.includes(searchInput.toLowerCase()) ||
      mappedProjectLanguage.includes(searchInput.toLowerCase()) ||
      mappedProjectURL.includes(searchInput.toLowerCase())
    ) {
      let thumbImageURL = "";
      const base64Data = String(allProjectsData.project_thumb_img);
      const bufferedImage = Buffer.from(base64Data, "base64");
      const bitData = new Uint8Array(bufferedImage);
      const blob = new Blob([bitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const file = new File([blob], `${allProjectsData.project_id}image.jpg`, {
        type: "image/jpeg",
      });

      thumbImageURL = URL.createObjectURL(file);

      return (
        <div
          className="single-project-wrapper"
          key={`${allProjectsData.project_id} + ${index}`}
        >
          <div className="project-title"> {allProjectsData.project_title} </div>

          <div className="project-image">
            {allProjectsData.project_thumb_img !== null ? (
              <img src={thumbImageURL} className="thumb-image-display" alt="" />
            ) : null}
          </div>

          <div className="project-development-type">
            {allProjectsData.project_development_type}
          </div>

          <div className="options-wrapper">
            <div
              className="project-edit"
              onClick={() => handleProjectEdit(allProjectsData.project_id)}
            >
              - Edit -
            </div>
            <div
              className="project-delete"
              onClick={() => handleProjectDelete(allProjectsData.project_id)}
            >
              - Delete -
            </div>
          </div>
        </div>
      );
    } else if (searchInput === "") {
      let thumbImageURL = "";
      const base64Data = String(allProjectsData.project_thumb_img);
      const bufferedImage = Buffer.from(base64Data, "base64");
      const bitData = new Uint8Array(bufferedImage);
      const blob = new Blob([bitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const file = new File([blob], `${allProjectsData.project_id}image.jpg`, {
        type: "image/jpeg",
      });

      thumbImageURL = URL.createObjectURL(file);

      return (
        <div
          className="single-project-wrapper"
          key={`${allProjectsData.project_id} + ${index}`}
        >
          <div className="project-title"> {allProjectsData.project_title} </div>

          <div className="project-image">
            {allProjectsData.project_thumb_img !== null ? (
              <img src={thumbImageURL} className="thumb-image-display" alt="" />
            ) : null}
          </div>

          <div className="project-development-type">
            {allProjectsData.project_development_type}
          </div>

          <div className="options-wrapper">
            <div
              className="project-edit"
              onClick={() => handleProjectEdit(allProjectsData.project_id)}
            >
              - Edit -
            </div>
            <div
              className="project-delete"
              onClick={() => handleProjectDelete(allProjectsData.project_id)}
            >
              - Delete -
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      <div className="manager-element">
        <div className="manager-header">Project Manager</div>

        <div className="projects-manager-wrapper">
          <div className="left-column">
            <input
              type="search"
              name="search"
              placeholder="search"
              onChange={handleSearchChange}
            />
            <div className="projects-wrapper">
              <div className="button-handles-wrapper">
                <div onClick={moveSliderdown} className="left-slider slider">
                  &#9651;
                </div>
                <div onClick={moveSliderUp} className="right-slider slider">
                  &#9661;
                </div>
              </div>

              <div className="current-projects-hider-wrapper">
                <div
                  style={{ transform: `translateY(${yOffset}px)` }}
                  className="current-users"
                >
                  {allProjectsRender}
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            {editorMode ? (
              <>
                <div className="project-form-wrapper">
                  <form
                    className="project-form"
                    onSubmit={(newChange) => handleSubmitEdit(newChange)}
                  >
                    <input
                      type="title"
                      name="title"
                      placeholder="Project Name"
                      value={projectTitle}
                      onChange={(newChange) =>
                        setProjectTitle(newChange.target.value)
                      }
                    />

                    <input
                      type="language"
                      name="language"
                      placeholder="Project Languages Used"
                      value={projectLanguage}
                      onChange={(newChange) =>
                        setProjectLanguage(newChange.target.value)
                      }
                    />

                    <select
                      type="development_type"
                      name="development_type"
                      id="select-list"
                      className="development-dropdown-options"
                      value={projectDevelopmentType}
                      onChange={(newChange) =>
                        setProjectDevelopmentType(newChange.target.value)
                      }
                    >
                      <option value="" className="development-option">
                        Please Choose One
                      </option>
                      <option value="Frontend" className="development-option">
                        Frontend
                      </option>
                      <option value="Full-Stack" className="development-option">
                        Full-Stack
                      </option>
                      <option value="Backend" className="development-option">
                        Backend
                      </option>
                    </select>

                    <input
                      type="text"
                      name="url"
                      placeholder="Project URL"
                      value={projectURL}
                      onChange={(newChange) =>
                        setProjectURL(newChange.target.value)
                      }
                    />

                    <textarea
                      type="description"
                      rows="4"
                      placeholder="description"
                      className="project-description"
                      value={projectDescription}
                      onChange={(newChange) =>
                        setProjectDescription(newChange.target.value)
                      }
                    />

                    <div className="image-drop-wrapper">
                      <div className="thumb-image-drop">
                        <Dropzone onDrop={handleUpdateThumbImageDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {thumbImageDropped ? (
                                <img
                                  className="dropped-image"
                                  src={URL.createObjectURL(thumbImageDropped)}
                                  alt=""
                                  style={{minWidth: '160px', minHeight: '160px'}}
                                />
                              ) : (
                                <div className="thumbImageText">
                                  <div className="text-center">Thumb Image</div>
                                </div>
                              )}
                            </div>
                          )}
                        </Dropzone>
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => setThumbImageDropped(null)}
                        >
                          Remove Image
                        </button>
                      </div>

                      <div className="logo-image-drop">
                        <Dropzone onDrop={handleUpdateLogoImageDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {logoImageDropped ? (
                                <img
                                  className="dropped-image"
                                  src={URL.createObjectURL(logoImageDropped)}
                                  alt=""
                                  style={{minWidth: '160px', minHeight: '160px'}}
                                />
                              ) : (
                                <div className="logoImageText">
                                  <div className="text-center">Logo Image</div>
                                </div>
                              )}
                            </div>
                          )}
                        </Dropzone>
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => setLogoImageDropped(null)}
                        >
                          Remove Image
                        </button>
                      </div>

                      <div className="hero-image-drop">
                        <Dropzone onDrop={handleUpdateHeroImageDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />

                              {heroImageDropped ? (
                                <img
                                  className="dropped-image"
                                  src={URL.createObjectURL(heroImageDropped)}
                                  alt=""
                                  style={{minWidth: '160px', minHeight: '160px'}}
                                />
                              ) : (
                                <div className="heroImageText">
                                  <div className="text-center">Hero Image</div>
                                </div>
                              )}
                            </div>
                          )}
                        </Dropzone>

                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => setHeroImageDropped(null)}
                        >
                          Remove Image
                        </button>
                      </div>

                    </div>

                    <button className="project-submit-btn" type="submit">
                      Submit
                    </button>

                    <div
                      className="project-edit-cancel-btn"
                      onClick={handleEditModeCancel}
                    >
                      Cancel
                    </div>

                    <div
                      className="errorMessage"
                      style={{ visibility: error ? "visible" : "hidden" }}
                    >
                      {errorMessage}
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <ProjectsForm />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectManager;
