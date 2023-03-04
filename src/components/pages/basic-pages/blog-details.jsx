import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import parse from "html-react-parser";
import he from "he";

import { useAppContext } from "../../../context.js";

const BlogDetails = () => {
  const { directory } = useAppContext();
  const { blogId } = useParams("");
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const grabBlog = async () => {
      try {
        const response = await fetch(`${directory}/blog/${blogId}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error(error);
      }
    };

    grabBlog();
  }, []);

  const blogContents = () => {
    let decodedBlogContents = he.decode(`${blog.blog_contents}`);
    let parsedDecodedBlogContents = parse(decodedBlogContents);

    return parsedDecodedBlogContents;
  };

  const blogHeroImage = () => {
    let heroImageURL = "";
    const heroBase64Data = String(blog.blog_hero_img);
    const heroBufferedImage = Buffer.from(heroBase64Data, "base64");
    const heroBitData = new Uint8Array(heroBufferedImage);
    const heroBlob = new Blob([heroBitData], {
      type: "image/jpeg,image/png,image/svg+xml",
    });
    const heroFile = new File([heroBlob], `${blog.blog_id}thumbimage.jpg`, {
      type: "image/jpeg",
    });

    heroImageURL = URL.createObjectURL(heroFile);

    return (
      <img src={heroImageURL}/>
    );
  };

  return (
    <div className="page-elements-wrapper">
      <h1>Blog Detail</h1>

      <div className="blog-details-wrapper">
        <div className="blog-details-elements">
          <div className="sub-header">
            <a href="/blog">
              <div className="go-back"> &#8592; Go Back</div>
            </a>
            <div className="date-logged">{blog.blog_date}</div>
          </div>
          <div className="img-details-link-wrapper">
            {blog.blog_hero_img ? blogHeroImage() : null}
          </div>
          <div className="blog-details-information">
            <div className="blog-details-header">
              <h2>{blog.blog_title}</h2>
            </div>
            <div className="blog-details-contents">{blogContents()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
