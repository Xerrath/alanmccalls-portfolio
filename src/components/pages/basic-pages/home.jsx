import React from 'react';

import AboutFeature from "../../features/home-page-features/about-feature.jsx";
import MissionFeature from "../../features/home-page-features/mission-feature.jsx";
import ProjectsFeature from "../../features/home-page-features/projects-feature.jsx";
import SkillsFeature from "../../features/home-page-features/skills-feature.jsx";
import TestimononialsFeature from "../../features/home-page-features/testimonials-feature.jsx";
import LinksFeature from "../../features/home-page-features/links-feature.jsx";
import ContactFeature from "../../features/home-page-features/contact-feature.jsx";

const home = () => {

  return (
    <>
      <div className="contents-wrapper" id="level-four">
        <AboutFeature />

        <MissionFeature />

        <ProjectsFeature />

        <SkillsFeature />

        <TestimononialsFeature />

        <LinksFeature />

        <ContactFeature />
      </div>
    </>
  )
}

export default home