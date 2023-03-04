import React from "react";

const ContactFeature = () => {
  return (
    <>
      <div className="contact-feature-wrapper" id="contact">
        <h1>Contact Feature</h1>

        <div className="feature-contents">
          <form
            className="contact-form"
            action="https://formsubmit.co/mccall.alan.dee@gmail.com"
            method="POST"
          >
            <div className="contact-form-two-column">
              <input type="text" name="name" placeholder="Your Name" />

              <input
                type="email"
                email="email"
                name="email"
                placeholder="Enter Your Email"
              />
            </div>

            <div className="contact-form-one-column">
              <textarea
                rows="8"
                name="message"
                placeholder="Enter Your Message"
                type="message"
                id="form-message"
                className="form-message"
              />
            </div>

            <button className="contact-btn" type="submit">
              Send
            </button>
          </form>
        </div>
        
      </div>
    </>
  );
};

export default ContactFeature;
