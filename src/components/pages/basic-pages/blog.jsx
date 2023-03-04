import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import parse from "html-react-parser";
import he from "he";

import { useAppContext } from "../../../context.js";

const Blog = () => {
  const navigate = useNavigate();
  const { directory } = useAppContext();
  const [allBlogs, setAllBlogs] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const grabAllBlogsByRelation = async () => {
      try {
        const response = await fetch(`${directory}/get/blogs/by/1`);
        const data = await response.json();
        setAllBlogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    grabAllBlogsByRelation();
  }, []);

  const handleNavigateToDetails = (id) => {
    navigate(`/blog/details/${id}`);
  }

  const handleSearchChange = (event) => {
    let search = event.target.value.toLowerCase();
    setSearchInput(search);
  };

  const allBlogsRender = allBlogs.map((allBlogs, index) => {
    let mappedBlogTitle = allBlogs.blog_title.toLowerCase();
    let mappedBlogDate = allBlogs.blog_date.toLowerCase();

    if (
      mappedBlogTitle.includes(searchInput.toLowerCase()) ||
      mappedBlogDate.includes(searchInput.toLowerCase())
    ) {
      let thumbImageURL = "";
      const thumbBase64Data = String(allBlogs.blog_thumb_img);
      const thumbBufferedImage = Buffer.from(thumbBase64Data, "base64");
      const thumbBitData = new Uint8Array(thumbBufferedImage);
      const thumbBlob = new Blob([thumbBitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const thumbFile = new File(
        [thumbBlob],
        `${allBlogs.blog_id}thumbimage.jpg`,
        {
          type: "image/jpeg",
        }
      );

      thumbImageURL = URL.createObjectURL(thumbFile);

      if (index % 2) {
        return (
          <div className="blog-wrapper version-one" key={index}>
            <div className="blog-elements">
              <div className="img-link-wrapper">
                <div className="blog-thumb-img">
                  {allBlogs.blog_thumb_img ? (
                    <div className="featured-logo">
                      <img
                        src={thumbImageURL}
                        className="thumb-image-display"
                        alt=""
                      />
                    </div>
                  ) : null}
                </div>
                <div className="details-link" onClick={() => handleNavigateToDetails(allBlogs.blog_id)}>
                  <div className="text-link"> - See More -</div>
                </div>
              </div>
              <div className="blog-information">
                <div className="blog-header">{allBlogs.blog_title}</div>
                <div className="blog-summary">
                  {parse(he.decode(allBlogs.blog_contents))}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="blog-wrapper version-two" key={index}>
            <div className="blog-elements">
              <div className="blog-information">
                <div className="blog-header">{allBlogs.blog_title}</div>
                <div className="blog-summary">
                  {parse(he.decode(allBlogs.blog_contents))}
                </div>
              </div>
              <div className="img-link-wrapper">
                <div className="blog-thumb-img">
                  {allBlogs.blog_thumb_img ? (
                    <div className="featured-logo">
                      <img
                        src={thumbImageURL}
                        className="thumb-image-display"
                        alt=""
                      />
                    </div>
                  ) : null}
                </div>
                <div className="details-link" onClick={() => handleNavigateToDetails(allBlogs.blog_id)}>
                  <div className="text-link"> - See More -</div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else if (searchInput === "") {
      let thumbImageURL = "";
      const thumbBase64Data = String(allBlogs.blog_thumb_img);
      const thumbBufferedImage = Buffer.from(thumbBase64Data, "base64");
      const thumbBitData = new Uint8Array(thumbBufferedImage);
      const thumbBlob = new Blob([thumbBitData], {
        type: "image/jpeg,image/png,image/svg+xml",
      });
      const thumbFile = new File(
        [thumbBlob],
        `${allBlogs.blog_id}thumbimage.jpg`,
        {
          type: "image/jpeg",
        }
      );

      thumbImageURL = URL.createObjectURL(thumbFile);

      if (index % 2) {
        return (
          <div className="blog-wrapper version-one" key={index}>
            <div className="blog-elements">
              <div className="img-link-wrapper">
                <div className="blog-thumb-img">
                  {allBlogs.blog_thumb_img ? (
                    <div className="featured-logo">
                      <img
                        src={thumbImageURL}
                        className="thumb-image-display"
                        alt=""
                      />
                    </div>
                  ) : null}
                </div>
                <a href={`/blog/details/${allBlogs.blog_id}`}>
                  <div className="text-link">- See More -</div>
                </a>
              </div>
              <div className="blog-information">
                <div className="blog-header">{allBlogs.blog_title}</div>
                <div className="blog-summary">
                  {parse(he.decode(allBlogs.blog_contents))}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="blog-wrapper version-two" key={index}>
            <div className="blog-elements">
              <div className="blog-information">
                <div className="blog-header">{allBlogs.blog_title}</div>
                <div className="blog-summary">
                  {parse(he.decode(allBlogs.blog_contents))}
                </div>
              </div>
              <div className="img-link-wrapper">
                <div className="blog-thumb-img">
                  {allBlogs.blog_thumb_img ? (
                    <div className="featured-logo">
                      <img
                        src={thumbImageURL}
                        className="thumb-image-display"
                        alt=""
                      />
                    </div>
                  ) : null}
                </div>
                <div className="details-link" onClick={() => handleNavigateToDetails(allBlogs.blog_id)}>
                  <div className="text-link"> - See More -</div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  });

  return (
    <>
      <div className="page-elements-wrapper">
        <h1>Blog Space</h1>

        <div className="blog-list-wrapper">
          <input
            type="search"
            name="search"
            placeholder="search"
            onChange={handleSearchChange}
          />

          <div className="blog-list">{allBlogsRender}</div>
        </div>
      </div>
    </>
  );
};

export default Blog;
