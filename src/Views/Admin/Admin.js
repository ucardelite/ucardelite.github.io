import Menu from "./Menu";
import "Styles/css/admin.css";
import Metals from "./Metals";
import Borders from "./Borders";
import Discounts from "./Discounts";
import Instagram from "./Instagram";
import { useState, useEffect } from "react";
import firebase from "FirebaseApp";
import Navbar from "./Navbar";
import Drawer from "@material-ui/core/Drawer";

const Admin = ({ setUser }) => {
  const [page, setPage] = useState("Metals");
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    //prevent scrolling on html node. It fixes ios ui.
    document.body.parentElement.style.overflowY = "hidden";

    return () => (document.body.parentElement.style.overflowY = "scroll");
  }, []);

  const MenuWithProps = () => {
    return (
      <Menu
        logout={() => {
          firebase.auth().signOut();
          setUser(null);
          window.location.replace("/");
        }}
        page={page}
        setPage={(index) => {
          setPage(index);
          setMenuOpened(false);
        }}
      ></Menu>
    );
  };
  return (
    <div
      className="position-fixed w-100 h-100 d-flex flex-wrap overflow-hidden"
      style={{ top: 0, left: 0 }}
    >
      <Navbar openMenu={() => setMenuOpened(true)}></Navbar>
      <Drawer open={menuOpened} onClose={() => setMenuOpened(false)}>
        <MenuWithProps></MenuWithProps>
      </Drawer>
      <div className="d-none d-md-flex h-100 flex-column">
        <MenuWithProps></MenuWithProps>
      </div>

      <div className="col px-5 pt-5 overflow-auto d-flex flex-wrap h-100">
        <div className="d-block d-md-none" style={{ height: 82, width: "100%" }}></div>
        {page === "Metals" ? (
          <Metals></Metals>
        ) : page === "Borders" ? (
          <Borders></Borders>
        ) : page === "Discounts" ? (
          <Discounts></Discounts>
        ) : page === "Instagram" ? (
          <Instagram></Instagram>
        ) : null}
      </div>
    </div>
  );
};

export default Admin;
