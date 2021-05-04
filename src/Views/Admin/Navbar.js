import Logo from "Assets/images/logo/logo2r.png";
import MenuIcon from "@material-ui/icons/Menu";

const Navbar = ({ openMenu }) => {
  return (
    <div className="admin-navbar d-flex w-100 d-md-none justify-content-between align-items-center p-3">
      <img width={199} src={Logo} alt=""></img>
      <MenuIcon
        className="text-white"
        style={{ cursor: "pointer" }}
        fontSize="large"
        onClick={openMenu}
      ></MenuIcon>
    </div>
  );
};

export default Navbar;
