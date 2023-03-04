import React from 'react';

import GuidePicture from '../../../static/personal-pictures/alan-mccall-guiding-scott-mcdaniels.jpg';

const AboutFeature = () => {
  return (
    <>
        <div className="about" id="about">
            <h1>About Me</h1>
            <div className='feature-contents'>
                <div className='top-section'>
                    <div className='top-bg-img' style={{
                        background: "url(" + GuidePicture + ") no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "10% 28%",
                        backgroundAttachement: "fixed"
                    }} />
                </div>
                <div className='bottom-section'>
                    <h2>Hello, my name is Alan! </h2>
                    <p>
                        I'm a full-stack software developer in Glendale, AZ.
                        A highly, passionate individual who works well with others to accomplish goals.
                        I enjoy learning new ideas, trying to solve them, and working with piers to accomplish the "bigger picture."
                    </p>
                    <p>
                        Being a US Army Veteran I have learned to be part of a team and to be just as efficient on my own.
                        I strive under pressure and am not affraid to fail and find a solution where persistance is the pinnacle of any innovative idea.
                    </p>
                </div>
            </div>
        </div>
    </>
  )
}

export default AboutFeature