import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Buffer } from 'buffer';

import { useAppContext } from "../../../../context.js";


const ProjectsForm = () => {
  const { adminLoggedIn, loggedIn, directory, adminAuth, setProjectsChangeDetected, setError, error, errorMessage, setErrorMessage } =
    useAppContext();
  const [projectName, setProjectName] = useState("");
  const [languages, setLanguages] = useState("");
  const [developmentType, setDevelopmentType] = useState("");
  const [description, setDescription] = useState("");
  const [projectURL, setProjectURL] = useState("");
  
  const [rawHeroImage, setRawHeroImage] = useState(null);
  const [rawThumbImage, setRawThumbImage] = useState(null);
  const [rawLogoImage, setRawLogoImage] = useState(null);
  const { FileReader } = window;

  const [heroImageDropped, setHeroImageDropped] = useState(null);
  const [thumbImageDropped, setThumbImageDropped] = useState(null);
  const [logoImageDropped, setLogoImageDropped] = useState(null);

  const handleSubmit = (newChange) => {
    newChange.preventDefault();

    if (projectName === "") {
      setError(true);
      setErrorMessage("You cannot have a blank Project Name!");
    } else {
      if (loggedIn === "ADMIN" && adminLoggedIn === true) {
        fetch(`${directory}/project/add`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            thumb_img: rawThumbImage ? Array.from(rawThumbImage): null,
            logo_img: rawLogoImage ? Array.from(rawLogoImage): null,
            hero_img: rawHeroImage ? Array.from(rawHeroImage): null,
            title: projectName,
            language: languages,
            development_type: developmentType,
            description: description,
            url: projectURL,
            admin_auth: adminAuth
          }),
        })
          .then((res) => res.json())
          .then((res) => {
              setError(true);
              setErrorMessage("Project has been successfully created");
              setProjectName("");
              setLanguages("");
              setDevelopmentType("");
              setDescription("");
              setProjectURL("");
              setRawHeroImage(null);
              setRawThumbImage(null);
              setRawLogoImage(null);
              setHeroImageDropped(null);
              setThumbImageDropped(null);
              setLogoImageDropped(null);
              setProjectsChangeDetected(true);
          })
          .catch((error) => {
            console.log("Error with creating project", error);
            setError(true);
            setErrorMessage("Error setting up your project, please try again!");
          });
      } else {
        setError(true);
        setErrorMessage(
          "Error setting up project, You must be a ADMIN to create a project!"
        );
      }
    }
  };

  const handleLogoImageDrop = (acceptedFiles) => {
    setLogoImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawLogoImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  const handleHeroImageDrop = (acceptedFiles) => {
    setHeroImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawHeroImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  const handleThumbImageDrop = (acceptedFiles) => {
    setThumbImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload= (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawThumbImage(bytes);
    }

    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <div className="project-form-wrapper">
        <form
          className="project-form"
          onSubmit={(newChange) => handleSubmit(newChange)}
        >
          <input
            type="title"
            name="title"
            placeholder="Project Name"
            value={projectName}
            onChange={(newChange) => setProjectName(newChange.target.value)}
          />

          <input
            type="language"
            name="language"
            placeholder="Project Languages Used"
            value={languages}
            onChange={(newChange) => setLanguages(newChange.target.value)}
          />

          <select
            type="development_type"
            name="development_type"
            id="select-list"
            className="development-dropdown-options"
            value={developmentType}
            onChange={(newChange) => setDevelopmentType(newChange.target.value)}
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
            onChange={(newChange) => setProjectURL(newChange.target.value)}
          />

          <textarea
            type="description"
            rows="4"
            placeholder="description"
            className="project-description"
            value={description}
            onChange={(newChange) => setDescription(newChange.target.value)}
          />

          <div className="image-drop-wrapper">
            
            <div className="thumb-image-drop">
              <Dropzone onDrop={handleThumbImageDrop}>
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()}/>
                      {thumbImageDropped ? (
                        <img className="dropped-image" src={URL.createObjectURL(thumbImageDropped)} alt="" />
                      ):(
                        <div className="thumbImageText">
                          <div className="text-center">
                            Thumb Image
                          </div>
                        </div>
                      )}

                  </div>
                )}
              </Dropzone>
              <button type="button" className="remove-image" onClick={() => setThumbImageDropped(null)}>Remove Image</button>
            </div>

            <div className="logo-image-drop">
              <Dropzone onDrop={handleLogoImageDrop}>
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()}/>
                      {logoImageDropped ? (
                        <img className="dropped-image" src={URL.createObjectURL(logoImageDropped)} alt="" />
                      ):(
                        <div className="logoImageText">
                          <div className="text-center">
                            Logo Image
                          </div>
                        </div>
                      )}

                  </div>
                )}
              </Dropzone>
              <button type="button" className="remove-image" onClick={() => setLogoImageDropped(null)}>Remove Image</button>
            </div>

            <div className="hero-image-drop">
              <Dropzone onDrop={handleHeroImageDrop}>
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()}/>

                    {heroImageDropped ? (
                      <img className="dropped-image" src={URL.createObjectURL(heroImageDropped)} alt="" />
                    ):(
                      <div className="heroImageText">
                        <div className="text-center">
                          Hero Image
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </Dropzone>

              <button type="button" className="remove-image" onClick={() => setHeroImageDropped(null)}>Remove Image</button>
            </div>

          </div>

          <button className="project-submit-btn" type="submit">
            Submit
          </button>

          <div
            className="errorMessage"
            style={{ visibility: error ? "visible" : "hidden" }}
          >
            {errorMessage}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectsForm;
