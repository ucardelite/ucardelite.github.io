import React from "react";
import { elastic as Menu } from "react-burger-menu";
import "../Styles/css/nav.css";
import Logo from "../Assets/images/logo/logo2r.png";
import { useLocation } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import TermsAndConditions from "Components/TermsAndConditions";

const NavigationMenu = ({ menu }) => {
  const location = useLocation();
  const [showTerms, setShowTerms] = React.useState(false);
  const show = !["login", "admin", "signup", "order-success", "order-cancelled"].includes(
    location.pathname.replace("/", "")
  );
  const [isOpen, setIsOpen] = React.useState(false);
  return show ? (
    <>
      <a href="/">
        <img src={Logo} className="logo-image" alt="Logo" />
      </a>
      <a
        onClick={() => setShowTerms(true)}
        className="cursor-pointer position-absolute d-none d-sm-block"
        style={{ right: 120, top: 34, zIndex: 10 }}
      >
        Terms & Conditions
      </a>
      <Modal open={showTerms}>
        <div
          className="w-100 h-100 d-flex overflow-auto p-sm-5 position-relative"
          onClick={() => setShowTerms(false)}
        >
          <div
            onClick={() => setShowTerms(false)}
            style={{
              position: "fixed",
              zIndex: 20,
              right: 10,
              top: 10,
              cursor: "pointer",
              background: "white",
              width: 35,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>&#10005;</span>
          </div>
          <div className="m-auto" onClick={(e) => e.stopPropagation()}>
            <TermsAndConditions></TermsAndConditions>
          </div>
        </div>
      </Modal>
      <Menu right noOverlay>
        {menu?.map((item, i) => (
          <div key={`menu-item-${i}`} className="menu-item">
            <span className="menu-bar"></span>
            <a href={item.pathname}>{item.name}</a>
          </div>
        ))}
      </Menu>
    </>
  ) : null;
};

export default NavigationMenu;
