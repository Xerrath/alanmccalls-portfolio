import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

import Edit from "../../../static/icons/edit.png";
import { useAppContext } from "../../../context.js";

const TestimonialManager = () => {
  const { navCollapsed, directory, adminAuth } = useAppContext();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [changeDetected, setChangeDetected] = useState(false);

  let contentsWrapperWidth = useRef(null);
  let [elementWidth, setWidth] = useState(0);
  let [xOffset, setXOffset] = useState(0);
  let totalElementsShown = Math.floor(elementWidth / 400);

  // when calculating index ()
  let elementsWithin = (allTestimonials.length - totalElementsShown) * 400;

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
          `${directory}/get/testimonials/by/admin/relation/${adminAuth}`
        );
        const data = await response.json();
        setAllTestimonials(data);
      } catch (error) {
        console.error(error);
      }
    };

    grabAllUsers();
    grabAllTestimonials();
    setChangeDetected(false);
  }, [changeDetected]);

  useEffect(() => {
    function handleResize() {
      setWidth(contentsWrapperWidth.current.offsetWidth);
      setXOffset(0);
      let totalElementsShown = Math.floor(elementWidth / 400);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  useLayoutEffect(() => {
    setWidth(contentsWrapperWidth.current.offsetWidth);
  });

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setXOffset(0);
  };

  function moveSliderRight() {
    if (xOffset > -elementsWithin) {
      setXOffset((xTranslate) => xTranslate - totalElementsShown * 400);
    } else {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  function moveSliderLeft() {
    if (xOffset < 0) {
      setXOffset((xTranslate) => xTranslate + totalElementsShown * 400);
    } else if (xOffset > 0) {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  const handleTestimonialDelete = async (id) => {
    try {
      const response = await fetch(`${directory}/testimonial/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data === "The selected Testimony has been deleted") {
        setError(true);
        setErrorMessage("The selected Testimony has been deleted!");
      }
    } catch (error) {
      console.error(error);
    }

    setChangeDetected(true);
  };

  function publishTestimonial(id, data) {
    fetch(`${directory}/testimonial/publish/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        review: data.testimonial_review,
        publish: true,
        user_id: data.testimonial_id_users,
        admin_id: data.testimonial_admin_id,
      }),
    });

    setChangeDetected(true);
    setError(true);
    setErrorMessage("The selected Testimony has been Published!");
  }

  const handleTestimonialPublished = async (id) => {
    try {
      const response = await fetch(`${directory}/testimonial/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      publishTestimonial(id, data);
    } catch (error) {
      console.error(error);
    }
  };

  function unpublishTestimonial(id, data) {
    fetch(`${directory}/testimonial/publish/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        review: data.testimonial_review,
        publish: false,
        user_id: data.testimonial_id_users,
        admin_id: data.testimonial_admin_id,
      }),
    });

    setChangeDetected(true);
  }

  const handleTestimonialUnpublished = async (id) => {
    try {
      const response = await fetch(`${directory}/testimonial/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      unpublishTestimonial(id, data);
    } catch (error) {
      console.error(error);
    }

    setError(true);
    setErrorMessage("The selected Testimony has been unpublished!");
  };

  const displayTestimonials = allTestimonials.map((allTestimonials) => {
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].user_id === allTestimonials.testimonial_id_users) {
        let userSearch = allUsers[i].user_name.toLowerCase();

        if (userSearch.includes(searchInput.toLowerCase())) {
          return (
            <>
              <div
                className="pending-testimony-wrapper"
                key={allTestimonials.testimonial_id}
              >
                <div className="testimony-wrapper">
                  <div className="clients-name">{allUsers[i].user_name}</div>

                  <div className="testimonial-contents">
                    {allTestimonials.testimonial_review}
                  </div>
                  <div className="company-url">{allUsers[i].user_url}</div>
                  {allTestimonials.testimonial_published ? (
                    <div className="testimonial-published">Published</div>
                  ) : (
                    <div className="testimonial-published">
                      Awaiting Approval
                    </div>
                  )}
                </div>

                <div className="approval-options-wrapper">
                  <div
                    className="center-text"
                    id="approve"
                    onClick={() =>
                      handleTestimonialPublished(allTestimonials.testimonial_id)
                    }
                  >
                    <div className="approve">&#10003;</div>
                  </div>
                  <div
                    className="center-text"
                    id="symbol-edit"
                    onClick={() =>
                      handleTestimonialUnpublished(allTestimonials.testimonial_id)
                    }
                  >
                    <div
                      className="symbol-edit"
                      style={{
                        background: "url(" + Edit + ") no-repeat",
                        backgroundSize: "cover",
                        backgroundAttachement: "fixed",
                      }}
                    />
                  </div>
                  <div
                    className="center-text"
                    id="deny-symbol"
                    onClick={() =>
                      handleTestimonialDelete(allTestimonials.testimonial_id)
                    }
                  >
                    <div className="Deny">&#215;</div>
                  </div>
                </div>
              </div>
            </>
          );
        } else if (searchInput === "") {
          return (
            <>
              <div
                className="pending-testimony-wrapper"
                key={allTestimonials.testimonial_id}
              >
                <div className="testimony-wrapper">
                  <div className="clients-name">{allUsers[i].user_name}</div>

                  <div className="testimonial-contents">
                    {allTestimonials.testimonial_review}
                  </div>
                  <div className="company-url">{allUsers[i].user_url}</div>
                </div>
                <div className="approval-options-wrapper">
                  <div
                    className="center-text"
                    id="approve"
                    onClick={() =>
                      handleTestimonialUnpublished(
                        allTestimonials.testimonial_id
                      )
                    }
                  >
                    <div className="approve">&#10003;</div>
                  </div>
                  <div
                    className="center-text"
                    id="symbol-edit"
                    onClick={() =>
                      handleTestimonialPublished(allTestimonials.testimonial_id)
                    }
                  >
                    <div
                      className="symbol-edit"
                      style={{
                        background: "url(" + Edit + ") no-repeat",
                        backgroundSize: "cover",
                        backgroundAttachement: "fixed",
                      }}
                    />
                  </div>
                  <div
                    className="center-text"
                    id="deny-symbol"
                    onClick={() =>
                      handleTestimonialDelete(allTestimonials.testimonial_id)
                    }
                  >
                    <div className="Deny">&#215;</div>
                  </div>
                </div>
              </div>
            </>
          );
        } else {
          return null;
        }
      }
    }
  });

  return (
    <>
      <div className="manager-element">
        <div className="manager-header">Testimonial Manager</div>

        <div className="testimonials-content-wrapper">
          <input
            type="search"
            name="search"
            placeholder="search"
            onChange={handleSearchChange}
          />

          <div className="testimoials-scroll-feature">
            <div className="scroll-wrapper">
              <div onClick={moveSliderLeft} className="left-slider slider">
                &#8249;
              </div>

              <div className="hider-wrapper">
                <div
                  className="testimonial-approval-wrapper"
                  ref={contentsWrapperWidth}
                  style={{ transform: `translateX(${xOffset}px)` }}
                >
                  {displayTestimonials}
                </div>
              </div>

              <div onClick={moveSliderRight} className="right-slider slider">
                &#8250;
              </div>
            </div>
          </div>
        </div>

        <div
          className="errorMessage"
          style={{ visibility: error ? "visible" : "hidden" }}
        >
          {errorMessage}
        </div>
      </div>
    </>
  );
};

export default TestimonialManager;
