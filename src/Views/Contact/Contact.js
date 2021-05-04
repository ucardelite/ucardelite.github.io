import React from "react";
import "../../Styles/css/contact.css";
import { AiOutlinePhone } from "react-icons/ai";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Form from "./Form";
import Tooltip from "@material-ui/core/Tooltip";

function Contact() {
  return (
    <div className="row contact-container">
      <div className="col-md-5 contact-left">
        <div className="contact-header">Contact</div>
      </div>
      <div className="col-md-7 contact-right">
        <div className="bg-white">
          <Form></Form>
        </div>

        <div className="social-div">
          <a href="https://www.instagram.com/ucardelite/" target="_blank">
            <FiInstagram className="social-icon" />
          </a>
          <a href="https://www.facebook.com/ucardelite" target="_blank">
            <FiFacebook className="social-icon" />
          </a>
          <a href="https://twitter.com/EliteUcard" target="_blank">
            <FiTwitter className="social-icon" />
          </a>
          <Tooltip
            classes={{ tooltip: "bg-black shadow-lg" }}
            title={
              <div
                style={{
                  fontSize: 22,
                }}
                className="p-3"
              >
                <div style={{ fontSize: 14 }} className="mb-3">
                  Call us
                </div>
                +27826882710
              </div>
            }
          >
            <div>
              <AiOutlinePhone className="social-icon" />
            </div>
          </Tooltip>
          <a href="https://api.whatsapp.com/send?phone=+27826882710" target="_blank">
            <div className="whatsapp-icon-container d-flex align-items-center justify-content-center">
              <FaWhatsapp className="whatsapp-icon" size={24} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
