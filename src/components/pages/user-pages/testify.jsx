import React, { useState, useEffect } from "react";

import { useAppContext } from "../../../context.js";

const Testify = () => {
  const { directory, user_id } = useAppContext();

  const [inputTextTestify, setInputTextTestify] = useState("");
  const [testifyCharacterLimit] = useState(240);
  const [characterLimitLarger, setCharacterLimitLarger] =
    useState("good-characters");
  const [issue, setIssue] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTestifyCharacterChange = (event) => {
    setInputTextTestify(event.target.value);
  };

  useEffect(() => {
    if (inputTextTestify.length > testifyCharacterLimit) {
      setCharacterLimitLarger("bad-characters");
      setIssue(true);
    } else if (inputTextTestify.length <= testifyCharacterLimit) {
      setCharacterLimitLarger("good-characters");
      setIssue(false);
    }
  }, [inputTextTestify, testifyCharacterLimit]);

  const handleSubmit = (newChange) => {
    newChange.preventDefault();

    if (inputTextTestify === "") {
      setError(true);
      setErrorMessage("You cannot have a blank Testimonial!");
    } else {
      // console.log(user_id);
      fetch(`${directory}/testimonial/add`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          review: inputTextTestify,
          user_id: user_id,
          publish: false,
          admin_id: 1
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res === "Error: The user is already registered.") {
            setError(true);
            setErrorMessage("Error: The user is already registered.");
          } else {
            setError(true);
            setErrorMessage("Testimony has been successfully submitted");
            setInputTextTestify("");
          }
        })
        .catch((error) => {
          console.log("Error with submitting your testimony", error);
          setError(true);
          setErrorMessage(
            "Error with submitting your testimony, please try again!"
          );
        });
    }
  };

  return (
    <>
      <div className="page-elements-wrapper">
        <h1>Testify Page</h1>

        <form
          className="testify-form"
          onSubmit={(newChange) => handleSubmit(newChange)}
        >
          <textarea
            rows="12"
            name="review"
            placeholder="Your Review"
            type="message"
            id="form-review"
            className="form-review"
            value={inputTextTestify}
            onChange={handleTestifyCharacterChange}
            isInvalid={inputTextTestify.length > testifyCharacterLimit}
          />

          <div className={characterLimitLarger}>
            {inputTextTestify.length} / {testifyCharacterLimit} Characters
          </div>

          {issue ? (
            <div className="testify-error">Error</div>
          ) : (
            <button className="testify-btn" type="submit">
              Submit
            </button>
          )}

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

export default Testify;
