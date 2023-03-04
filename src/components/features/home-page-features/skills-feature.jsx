import React from "react";

const skillsArr = [
  {
    skill: "HTML",
    confidence: "100%",
  },
  {
    skill: "CSS",
    confidence: "99%",
  },
  {
    skill: "SASS/SCSS",
    confidence: "99%",
  },
  {
    skill: "Python",
    confidence: "80%",
  },
  {
    skill: "JavaScript",
    confidence: "99%",
  },
  {
    skill: "REACT.js",
    confidence: "80%",
  },
  {
    skill: "Mongo DB",
    confidence: "40%",
  },
  {
    skill: "Postman",
    confidence: "60%",
  },
  {
    skill: "UML",
    confidence: "70%",
  },
  {
    skill: "SQL",
    confidence: "70%",
  },
  {
    skill: "MySQL",
    confidence: "70%",
  },
  {
    skill: "PostgreSQL",
    confidence: "80%",
  },
  {
    skill: "pgAdmin 4",
    confidence: "80%",
  },
  // {
  //   skill: "TypeScript",
  //   confidence: "20%",
  // },
  // {
  //   skill: "Angular",
  //   confidence: "01%",
  // },
  // {
  //   skill: "Lua",
  //   confidence: "01%",
  // },
  // {
  //   skill: "C#",
  //   confidence: "01%",
  // },
  // {
  //   skill: "NEXT.JS",
  //   confidence: "20%",
  // },
];

const skillsMapper = skillsArr.map((skills, index) => {
  return (
    <div className="skill" id={skills.skill} key={index}>

      <div className="text-field">
        <div className="text">{skills.skill}</div>
        <div className="confidence">{skills.confidence}</div>
      </div>

      <div className="shader-level-one" style={{ width: `${skills.confidence}` }}>
        <div className="shader-level-two">
          <div className="shader-level-three">
            <div className="shader-level-four">
              {/* leave empty for styling effects */}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
});

const SkillsFeature = () => {
  return (
    <>
      <div className="skills-wrapper" id="skills">
        <h1>Skills</h1>

        <div className="feature-contents">
          <div className="skills-grid">

            {skillsMapper}

            <div className="skill">
              <div className="text-field">
                <div className="text">More To Come...</div>
                <div className="confidence">...</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SkillsFeature;
