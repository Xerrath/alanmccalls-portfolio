import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import DOMPurify from "dompurify";
import Dropzone from "react-dropzone";
import { Editor } from "@tinymce/tinymce-react";
import { Buffer } from "buffer";

import { useAppContext } from "../../../context.js";
import BlogForm from "./manager-features/blog-form-feature.jsx";

const BlogManager = () => {
  const {
    navCollapsed,
    adminLoggedIn,
    loggedIn,
    directory,
    adminAuth,
    setError,
    error,
    setErrorMessage,
    errorMessage,
    setBlogChangesDetected,
    blogChangesDetected,
  } = useAppContext();
  const [blogContent, setBlogContent] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [editorMode, setEditorMode] = useState(false);

  // All Blogs
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogId, setBlogId] = useState();
  const [blogData, setBlogData] = useState([]);

  // Blog Search
  const [searchInput, setSearchInput] = useState("");

  const [rawHeroImage, setRawHeroImage] = useState(null);
  const [rawThumbImage, setRawThumbImage] = useState(null);
  const { FileReader } = window;

  const [rawCalledThumbImg, setRawCalledThumbImg] = useState(null);
  const [rawCalledHeroImg, setRawCalledHeroImg] = useState(null);
  const [heroImageDropped, setHeroImageDropped] = useState(null);
  const [thumbImageDropped, setThumbImageDropped] = useState(null);

  let contentsWrapperWidth = useRef(null);
  let [elementWidth, setWidth] = useState(0);
  let [xOffset, setXOffset] = useState(0);
  let totalElementsShown = Math.floor(elementWidth / 350);

  // when calculating index ()
  let elementsWithin = (allBlogs.length - totalElementsShown) * 350;

  useEffect(() => {
    function handleResize() {
      setWidth(contentsWrapperWidth.current.offsetWidth);
      setXOffset(0);
      let totalElementsShown = Math.floor(elementWidth / 350);

      return totalElementsShown;
    }
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  });

  useLayoutEffect(() => {
    setWidth(contentsWrapperWidth.current.offsetWidth);
  }, [contentsWrapperWidth]);

  useEffect(() => {
    setError(false);
    setErrorMessage("");

    if (adminAuth === "1") {
      const grabAllUsers = async () => {
        try {
          const response = await fetch(`${directory}/get/blogs`);
          const data = await response.json();
          setAllBlogs(data);
        } catch (error) {
          console.error(error);
        }
      };
      grabAllUsers();
    } else {
      const grabAllBlogsByRelation = async () => {
        try {
          const response = await fetch(
            `${directory}/get/blogs/by/${adminAuth}`
          );
          const data = await response.json();
          setAllBlogs(data);
        } catch (error) {
          console.error(error);
        }
      };
      grabAllBlogsByRelation();
    }

    setBlogChangesDetected(false);
  }, [
    adminAuth,
    directory,
    blogChangesDetected,
    setBlogChangesDetected,
    setError,
    setErrorMessage,
  ]);

  function moveSliderRight() {
    if (xOffset > -elementsWithin) {
      setXOffset((xTranslate) => xTranslate - totalElementsShown * 350);
    } else {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  function moveSliderLeft() {
    if (xOffset < 0) {
      setXOffset((xTranslate) => xTranslate + totalElementsShown * 350);
    } else if (xOffset > 0) {
      setXOffset((xTranslate) => (xTranslate = 0));
    }
  }

  const handleSearchChange = (event) => {
    let search = event.target.value.toLowerCase();
    setSearchInput(search);
    setXOffset(0);
  };

  const handleBlogDelete = async (id) => {
    try {
      const response = await fetch(`${directory}/blog/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data === "The selected blog has been deleted") {
        setError(true);
        setErrorMessage("Blog has been successfully deleted!");
      }
    } catch (error) {
      console.error(error);
    }

    setBlogChangesDetected(true);
  };

  function updateHeroImage(rawCalledHeroImg) {
    const heroImgStr = String(rawCalledHeroImg);
    const heroImgBuffered = Buffer.from(heroImgStr, "base64");
    const heroImgByte = new Uint8Array(heroImgBuffered);
    const heroImgBlob = new Blob([heroImgByte], {
      type: "image/jpeg,image/png,image/svg+xml",
    });
    const heroImgFile = new File([heroImgBlob], `${blogId}image.jpg`, {
      type: "image/jpeg",
    });

    handleUpdateHeroImageDrop([heroImgFile]);
  }

  function updateThumbImage(rawCalledThumbImg) {
    const thumbImgStr = String(rawCalledThumbImg);
    const thumbImgBuffered = Buffer.from(thumbImgStr, "base64");
    const thumbImgByte = new Uint8Array(thumbImgBuffered);
    const thumbImgBlob = new Blob([thumbImgByte], {
      type: "image/jpeg,image/png,image/svg+xml",
    });
    const thumbImgFile = new File([thumbImgBlob], `${blogId}image.jpg`, {
      type: "image/jpeg",
    });

    handleUpdateThumbImageDrop([thumbImgFile]);
  }

  useEffect(() => {
    if (editorMode === true) {
      setBlogId(blogData.blog_id);
      setRawCalledThumbImg(blogData.blog_thumb_img);
      setRawCalledHeroImg(blogData.blog_hero_img);
      setBlogContent(blogData.blog_contents);
      setBlogDate(blogData.blog_date);
      setBlogTitle(blogData.blog_title);
    } else if (editorMode === false) {
      setBlogId();
      setRawCalledThumbImg();
      setRawCalledHeroImg();
      setBlogContent("");
      setBlogDate("");
      setBlogTitle("");
    }

    updateThumbImage(rawCalledThumbImg);
    updateHeroImage(rawCalledHeroImg);
  }, [editorMode, blogData, rawCalledThumbImg, rawCalledHeroImg]);

  const handleBlogEdit = async (id) => {
    try {
      const response = await fetch(`${directory}/blog/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setBlogData(data);
      setError(true);
      setErrorMessage(`Blog ${data.blog_title} has been selected for edit!`);
    } catch (error) {
      console.error(error);
    }

    setEditorMode(true);
  };

  function handleEditModeCancel() {
    setEditorMode(false);
    setError(true);
    setErrorMessage("Editing this blog has been Canceled");
    setRawCalledThumbImg(null);
    setRawCalledHeroImg(null);
    setRawHeroImage(null);
    setRawThumbImage(null);
    setHeroImageDropped(null);
    setThumbImageDropped(null);
    setBlogDate("");
    setBlogContent("");
    setBlogTitle("");
    setBlogId();
    setBlogData([]);
  }

  function handleSubmitBlogEdit(newChange) {
    newChange.preventDefault();

    fetch(`${directory}/blog/edit/${blogId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        updated_title: blogTitle,
        updated_content: blogContent,
        updated_blog_date: blogDate,
        admin_auth: adminAuth,
        updated_hero_img: rawHeroImage ? Array.from(rawHeroImage): null,
        updated_thumb_img: rawThumbImage ? Array.from(rawThumbImage): null
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res === "Blog was not found.") {
          setError(true);
          setErrorMessage("Blog was not found.");
        } else {
          setError(true);
          setErrorMessage("Blog has been successfully Edited");
          setRawCalledThumbImg(null);
          setRawCalledHeroImg(null);
          setRawHeroImage(null);
          setRawThumbImage(null);
          setHeroImageDropped(null);
          setThumbImageDropped(null);
          setBlogDate("");
          setBlogContent("");
          setBlogTitle("");
          setEditorMode(false);
          setBlogId();
          setBlogData([]);
        }
      })
      .catch((error) => {
        console.log("Error with editing blog", error);
        setError(true);
        setErrorMessage("Error editing blog, please try again!");
      });
  }

  const handleUpdateThumbImageDrop = (acceptedFiles) => {
    setThumbImageDropped(null);
    setThumbImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawThumbImage(bytes);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpdateHeroImageDrop = (acceptedFiles) => {
    setHeroImageDropped(null);
    setHeroImageDropped(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bytes = new Uint8Array(event.target.result);
      setRawHeroImage(bytes);
    };

    reader.readAsArrayBuffer(file);
  };

  const allBlogsRender = allBlogs.map((allBlogs, index) => {
    let mappedBlogTitle = allBlogs.blog_title.toLowerCase();
    let mappedBlogDate = allBlogs.blog_date.toLowerCase();

    if (
      mappedBlogTitle.includes(searchInput.toLowerCase()) ||
      mappedBlogDate.includes(searchInput.toLowerCase())
    ) {
      let thumbImageURL = "";
      const base64Data = String(allBlogs.blog_thumb_img);
      const bufferedImage = Buffer.from(base64Data, "base64");
      const bitData = new Uint8Array(bufferedImage);
      const blob = new Blob([bitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const file = new File([blob], `${allBlogs.blog_id}image.jpg`, {
        type: "image/jpeg",
      });

      thumbImageURL = URL.createObjectURL(file);

      return (
        <div className="slide-contents-wrapper" key={allBlogs.blog_id}>
          <div className="blog-info-wrapper">
            <div className="blog-title">{allBlogs.blog_title}</div>
            <div className="blog-date-posted">{allBlogs.blog_date}</div>
          </div>
          <div className="thumb-image-preview">
            {allBlogs.blog_thumb_img !== null ? (
              <img src={thumbImageURL} className="thumb-image-display" alt="" />
            ) : null}
          </div>
          <div className="select-wrapper">
            <div
              className="edit-wrapper"
              onClick={() => handleBlogEdit(allBlogs.blog_id)}
            >
              - Edit -
            </div>
            <div
              className="delete-wrapper"
              onClick={() => handleBlogDelete(allBlogs.blog_id)}
            >
              - Delete -
            </div>
          </div>
        </div>
      );
    } else if (searchInput === "") {
      let thumbImageURL = "";
      const base64Data = String(allBlogs.blog_thumb_img);
      const bufferedImage = Buffer.from(base64Data, "base64");
      const bitData = new Uint8Array(bufferedImage);
      const blob = new Blob([bitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const file = new File([blob], `${allBlogs.blog_id}image.jpg`, {
        type: "image/jpeg",
      });

      thumbImageURL = URL.createObjectURL(file);

      return (
        <div className="slide-contents-wrapper" key={allBlogs.blog_id}>
          <div className="blog-info-wrapper">
            <div className="blog-title">{allBlogs.blog_title}</div>
            <div className="blog-date-posted">{allBlogs.blog_date}</div>
          </div>
          <div className="thumb-image-preview">
            {allBlogs.blog_thumb_img !== null ? (
              <img src={thumbImageURL} className="thumb-image-display" alt="" />
            ) : null}
          </div>
          <div className="select-wrapper">
            <div
              className="edit-wrapper"
              onClick={() => handleBlogEdit(allBlogs.blog_id)}
            >
              - Edit -
            </div>
            <div
              className="delete-wrapper"
              onClick={() => handleBlogDelete(allBlogs.blog_id)}
            >
              - Delete -
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      <div className="manager-element">
        <div className="manager-header">Blog Manager</div>

        <div className="Blog-editor-wrapper">
          <div className="editor-header-wrapper">
            <div className="editor-title">Edit Blog</div>
            <div className="editor-directions">Please Select One</div>
            <input
              type="search"
              name="search"
              placeholder="search"
              onChange={handleSearchChange}
            />
          </div>

          <div className="scroll-wrapper">
            <div onClick={moveSliderLeft} className="left-slider slider">
              &#8249;
            </div>

            <div className="blog-scroll-hider-wrapper">
              <div
                className="blog-filtered-wrapper"
                ref={contentsWrapperWidth}
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                {allBlogsRender}
              </div>
            </div>

            <div onClick={moveSliderRight} className="right-slider slider">
              &#8250;
            </div>
          </div>
        </div>

        {editorMode ? (
          <>
            <form
              className="blog-manager-form"
              onSubmit={(newChange) => handleSubmitBlogEdit(newChange)}
            >
              <div>
                <h2>Edit Blog</h2>
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
                  <Dropzone onDrop={handleUpdateHeroImageDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />

                        {heroImageDropped ? (
                          <img
                            className="dropped-image"
                            src={URL.createObjectURL(heroImageDropped)}
                            alt=""
                            style={{ minWidth: "160px", minHeight: "160px" }}
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
                  <Dropzone onDrop={handleUpdateThumbImageDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {thumbImageDropped ? (
                          <img
                            className="dropped-image"
                            src={URL.createObjectURL(thumbImageDropped)}
                            alt=""
                            style={{ minWidth: "160px", minHeight: "160px" }}
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
                Submit Changes
              </button>

              <div
                className="blog-edit-cancel-btn"
                onClick={handleEditModeCancel}
              >
                Cancel
              </div>

              <div
                className="errorMessage"
                style={{ visibility: error ? "visible" : "hidden" }}
              >
                {errorMessage}
              </div>
            </form>
          </>
        ) : (
          <BlogForm />
        )}
      </div>
    </>
  );
};

export default BlogManager;
