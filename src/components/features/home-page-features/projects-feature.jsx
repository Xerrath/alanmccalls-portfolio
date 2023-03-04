import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Buffer } from "buffer";

import { useAppContext } from "../../../context";

const ProjectsFeature = () => {
  const { directory, navCollapsed } = useAppContext();
  const [allProjectsData, setAllProjectsData] = useState([]);

  const [eachProjectElementsWidth, setEachProjectElementsWidth] = useState(600);
  let projectsElementsWrapperWidth = useRef();
  let [elementWidth, setWidth] = useState(0);
  let [xOffset, setXOffset] = useState(0);
  let totalElementsShown = Math.floor(elementWidth / eachProjectElementsWidth);

  let elementsWithin = (allProjectsData.length - totalElementsShown) * eachProjectElementsWidth;

  useEffect(() => {
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
  }, []);

  const projectsRender = allProjectsData.map((allProjectsData, index) => {
    let logoImageURL = "";
    const logoBase64Data = String(allProjectsData.project_logo_img);
    const logoBufferedImage = Buffer.from(logoBase64Data, "base64");
    const logoBitData = new Uint8Array(logoBufferedImage);
    const logoBlob = new Blob([logoBitData], {
      type: "image/jpeg,image/png,image/svg+xml",
    });
    const logoFile = new File(
      [logoBlob],
      `${allProjectsData.project_id}logoimage.jpg`,
      {
        type: "image/jpeg",
      }
    );

    logoImageURL = URL.createObjectURL(logoFile);

    let heroImageURL = "";
    const heroBase64Data = String(allProjectsData.project_logo_img);
    const heroBufferedImage = Buffer.from(heroBase64Data, "base64");
    const heroBitData = new Uint8Array(heroBufferedImage);
    const heroBlob = new Blob([heroBitData], {
      type: "image/jpeg,image/png,image/svg+xml",
    });
    const heroFile = new File(
      [heroBlob],
      `${allProjectsData.project_id}logoimage.jpg`,
      {
        type: "image/jpeg",
      }
    );

    heroImageURL = URL.createObjectURL(heroFile);

    return (
      <div
        className="featured-slider-contents"
        id="previous-rolo"
        key={allProjectsData.project_id}
      >
        <div className="feature-wrapper">
          <div className="columns">
            <div className="development-wrapper">
              <div className="development">
                <div className="type">Development Type</div>
                <div className="development-type">
                  {allProjectsData.project_development_type}
                </div>
              </div>
              {allProjectsData.project_logo_img ? (
                <div className="featured-logo">
                  <img
                    src={logoImageURL}
                    className="thumb-image-display"
                    alt=""
                  />
                </div>
              ) : null}

              <div className="development">
                <div className="type">Language</div>
                <div className="language-type">
                  {allProjectsData.project_language}
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="feature-title">
                {allProjectsData.project_title}
              </div>
              <div className="make-right">
                <div className="feature-description">
                  {allProjectsData.project_description}
                </div>
              </div>
            </div>
          </div>

          <div className="project-link-wrapper">
            <a
              className="web-link"
              href={allProjectsData.project_url}
              target="_blank"
              rel="noreferrer"
            >
              Web Link
            </a>
          </div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    function handleResize() {
      let windowWidth = projectsElementsWrapperWidth.current.offsetWidth

      if (windowWidth <= 500) {
        setEachProjectElementsWidth(184);
        setWidth(windowWidth);
        setXOffset(0);
      } else if (windowWidth > 500 && windowWidth <= 860) {
        setEachProjectElementsWidth(324);
        setWidth(windowWidth);
        setXOffset(0);
      } else {
        setEachProjectElementsWidth(600);
        setWidth(windowWidth);
        setXOffset(0);
      }
      let totalElementsShown = Math.floor(elementWidth / eachProjectElementsWidth);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  useLayoutEffect(() => {
    setWidth(projectsElementsWrapperWidth.current.offsetWidth);
  }, [navCollapsed, elementsWithin, elementWidth]);

  function moveSliderLeft() {
    if (xOffset < 0) {
      setXOffset((xTranslate) => xTranslate + totalElementsShown * eachProjectElementsWidth);
    } else if (xOffset > 0) {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  function moveSliderRight() {
    if (xOffset > -elementsWithin) {
      setXOffset((xTranslate) => xTranslate - totalElementsShown * eachProjectElementsWidth);
    } else {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  return (
    <>
      <div className="projects-feature-wrapper" id="projects">
        <h1>Projects Feature</h1>

        <div className="feature-contents">
          <div className="left-carousel slider" onClick={moveSliderLeft}>
            &#8249;
          </div>

          <div className="slider-contents-wrapper">
            <div
              className="slider-contents-wrapper-hider"
              ref={projectsElementsWrapperWidth}
              style={{ transform: `translateX(${xOffset}px)` }}
            >
              {projectsRender}
            </div>
          </div>

          <div onClick={moveSliderRight} className="right-carousel slider">
            &#8250;
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsFeature;
