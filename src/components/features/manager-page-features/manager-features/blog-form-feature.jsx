import React, { useState } from "react";
import DOMPurify from "dompurify";
import Dropzone from "react-dropzone";
import { Editor } from "@tinymce/tinymce-react";
import { Buffer } from "buffer";

import { useAppContext } from "../../../../context.js";

const BlogForm = () => {
  const {
    adminLoggedIn,
    loggedIn,
    directory,
    adminAuth,
    setBlogChangesDetected,
    setError,
    error,
    errorMessage,
    setErrorMessage,
  } = useAppContext();
  const [blogContent, setBlogContent] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [blogTitle, setBlogTitle] = useState("");

  const [rawHeroImage, setRawHeroImage] = useState(null);
  const [rawThumbImage, setRawThumbImage] = useState(null);
  const { FileReader } = window;

  const [heroImageDropped, setHeroImageDropped] = useState(null);
  const [thumbImageDropped, setThumbImageDropped] = useState(null);

  const handleHeroImageDrop = (acceptedFiles) => {
    setHeroImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawHeroImage(bytes);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleThumbImageDrop = (acceptedFiles) => {
    setThumbImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawThumbImage(bytes);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmitBlog = (newBlog) => {
    newBlog.preventDefault();

    const sanitizedBlogContent = DOMPurify.sanitize(blogContent);

    if (blogTitle === "" && blogContent === "") {
      setError(true);
      setErrorMessage("You cannot have a blank blog title or content!");
    } else {
      if (loggedIn === "ADMIN" && adminLoggedIn === true) {
        fetch(`${directory}/blog/add`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            thumb_img: rawThumbImage ? Array.from(rawThumbImage) : null,
            hero_img: rawHeroImage ? Array.from(rawHeroImage) : null,
            title: blogTitle,
            contents: sanitizedBlogContent,
            date: blogDate,
            admin_auth: adminAuth,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setError(true);
            setErrorMessage("Blog has been successfully created");
            setBlogContent("");
            setBlogDate("");
            setBlogTitle("");
            setHeroImageDropped(null);
            setThumbImageDropped(null);
            setBlogChangesDetected(true);
          })
          .catch((error) => {
            console.log("Error with creating the blog", error);
            setError(true);
            setErrorMessage("Error setting up your blog, please try again!");
          });
      } else {
        setError(true);
        setErrorMessage(
          "Error setting up project, You must be a ADMIN to create a Blog!"
        );
      }
    }
  };

  return (
    <>
      <form className="blog-manager-form" onSubmit={handleSubmitBlog}>
        <div>
          <h2>Add A Blog</h2>
        </div>

        <input
          type="date"
          name="date"
          placeholder="Date"
          value={blogDate}
          onChange={(newChange) => setBlogDate(newChange.target.value)}
        />

        <input
          type="text"
          name="blog-title"
          placeholder="Blog Title"
          value={blogTitle}
          onChange={(newChange) => setBlogTitle(newChange.target.value)}
        />

        <Editor
          value={blogContent}
          onEditorChange={(content) => setBlogContent(content)}
          apiKey="mqifv0gyskyuu1eq2empd3wgxy8rwqu8im6n0j0aws2lxkct"
          init={{
            height: 400,
            menubar: true,
            plugins: ["code"],
            toolbar:
              "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code",
            content_style:
              "body {     font-family: tachyon, sans-serif; font-weight: 400; font-style: normal; }",
          }}
        />

        <div className="dropzone-wrapper">
          <div className="hero-image-drop">
            <Dropzone onDrop={handleHeroImageDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />

                  {heroImageDropped ? (
                    <img
                      className="dropped-image"
                      src={URL.createObjectURL(heroImageDropped)}
                      alt=""
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
          <div className="thumb-image-drop">
            <Dropzone onDrop={handleThumbImageDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {thumbImageDropped ? (
                    <img
                      className="dropped-image"
                      src={URL.createObjectURL(thumbImageDropped)}
                      alt=""
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
        </div>
        <button className="create-blog-btn" type="submit">
          Submit
        </button>
        <div
          className="errorMessage"
          style={{ visibility: error ? "visible" : "hidden" }}
        >
          {errorMessage}
        </div>
      </form>
    </>
  );
};

export default BlogForm;
