import React from "react";

import instagram from '../../../static/icons/Instagram-logo.png';
import linkedIn from '../../../static/icons/linkedin.png';
import gitHub from '../../../static/icons/github.png';

const LinksFeature = () => {
  return (
    <>
      <div className="hotlinks" id="personal-links">
        <h1>Personal Links</h1>

        <div className="feature-contents">
          <div className="links-wrapper">
            <a
              href="https://www.instagram.com/simplifiedd/"
              target="_blank"
              rel="noreferrer"
            >
              <img alt="instagram" src={instagram} />
            </a>

            <a
              href="https://www.linkedin.com/in/alan-mccall-2797b486/"
              target="_blank"
              rel="noreferrer"
            >
              <img alt="linkedIn" src={linkedIn} />
            </a>

            <a
              href="https://github.com/Xerrath"
              target="_blank"
              rel="noreferrer"
            >
              <img alt="gitHub" src={gitHub} />
            </a>
          </div>
        </div>

      </div>
    </>
  );
};

export default LinksFeature;
