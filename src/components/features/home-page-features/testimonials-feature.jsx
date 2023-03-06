import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

import { useAppContext } from "../../../context";

const TestimonialsFeature = () => {
  const { navCollapsed, directory, adminAuth } = useAppContext();
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [calculatedLength, setCalculatedLength] = useState(0);
  let publishedTestimonials = [];

  const [eachTestimonialElementsWidth, setEachProjectElementsWidth] = useState(336);
  let testimonialContentsWrapperWidth = useRef();
  let [elementWidth, setWidth] = useState(0);
  let [xOffset, setXOffset] = useState(0);
  let totalElementsShown = Math.floor(elementWidth / eachTestimonialElementsWidth);

  // when calculating index ()
  let elementsWithin = (calculatedLength - totalElementsShown) * eachTestimonialElementsWidth;

  useEffect(() => {
    const grabAllUsers = async () => {
      try {
        const response = await fetch(`${directory}/users`);
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    const grabAllTestimonials = async () => {
      try {
        const response = await fetch(
          `${directory}/get/testimonials/by/admin/relation/1`
        );
        const data = await response.json();
        setAllTestimonials(data);

        publishedTestimonials = [];
        setCalculatedLength(0);

        for (let i = 0; i < data.length; i++) {
          if (data[i].testimonial_published === true) {
            publishedTestimonials.push(data[i]);
          }
        }
        
        setCalculatedLength(publishedTestimonials.length);
      } catch (error) {
        console.error(error);
      }
    };

    grabAllUsers();
    grabAllTestimonials();
  }, []);

  useEffect(() => {
    function handleResize() {
      let windowWidth = testimonialContentsWrapperWidth.current.offsetWidth

      if (windowWidth <= 500) {
        setEachProjectElementsWidth(184);
        setWidth(windowWidth);
        setXOffset(0);
      } else if (windowWidth > 500 && windowWidth <= 860) {
        setEachProjectElementsWidth(256);
        setWidth(windowWidth);
        setXOffset(0);
      } else if (windowWidth > 860) {
        setEachProjectElementsWidth(336);
        setWidth(windowWidth);
        setXOffset(0);
      }

      let totalElementsShown = Math.floor(elementWidth / eachTestimonialElementsWidth);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  useLayoutEffect(() => {
    setWidth(testimonialContentsWrapperWidth.current.offsetWidth);
  });

  function moveSliderRight() {
    setWidth(testimonialContentsWrapperWidth.current.offsetWidth);
    let totalElementsShown = Math.floor(elementWidth / eachTestimonialElementsWidth);

    if (xOffset > -elementsWithin) {
      setXOffset((xTranslate) => xTranslate - totalElementsShown * eachTestimonialElementsWidth);
    } else {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  function moveSliderLeft() {
    setWidth(testimonialContentsWrapperWidth.current.offsetWidth);
    let totalElementsShown = Math.floor(elementWidth / eachTestimonialElementsWidth);
    
    if (xOffset < 0) {
      setXOffset((xTranslate) => xTranslate + totalElementsShown * eachTestimonialElementsWidth);
    } else if (xOffset > 0) {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  const displayPublishedTestimonials = allTestimonials.map(
    (allTestimonials, index) => {
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].user_id === allTestimonials.testimonial_id_users) {
          if (allTestimonials.testimonial_published === true) {
            return (
                <div className="slider-contents" key={allUsers[i].user_name + index}>
                  <div className="feature-wrapper" activeclassname="spotlight">
                    <div className="featured-name">{allUsers[i].user_name}</div>
                    <div className="testimonial">
                      {allTestimonials.testimonial_review}
                    </div>
                    <a
                      href={allUsers[i].user_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="website-link">Web Link &#8594;</div>
                    </a>
                  </div>
                </div>
            );
          } else {
            return null;
          }
        }
      }
    }
  );

  return (
    <>
      <div className="testimonials-features-wrapper" id="testimonials">
        <h1>Testimonials Feature</h1>

        <div className="feature-contents">
          <div onClick={moveSliderLeft} className="left-slider slider">
            &#8249;
          </div>

          <div className="testimonial-hider-wrapper">
            <div
              ref={testimonialContentsWrapperWidth}
              style={{ transform: `translateX(${xOffset}px)` }}
              className="testimonial-contents-wrapper"
            >
              {displayPublishedTestimonials}
            </div>
          </div>

          <div onClick={moveSliderRight} className="right-slider slider">
            &#8250;
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsFeature;
