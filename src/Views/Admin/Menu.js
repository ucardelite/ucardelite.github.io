import Logo from "Assets/images/logo/logo2r.png";
import ButtonBase from "@material-ui/core/ButtonBase";

const items = ["Metals", "Borders", "Discounts", "Instagram"];

const Menu = ({ setPage, page, logout }) => {
  return (
    <div className="admin-menu p-5 d-flex flex-column flex-grow-1">
      <img className="mb-5" width={199} src={Logo} alt=""></img>
      {items.map((x, i) => (
        <div
          onClick={() => setPage(x)}
          key={`menu-item-${i}`}
          className="d-flex align-items-center mb-4 admin-menu-item"
        >
          <div className="bg-yellow mr-4" style={{ width: 14, height: 3 }}></div>
          <div className={`${page === x ? "text-yellow" : "text-white"}`}>{x}</div>
        </div>
      ))}
      <div className="flex-grow-1 d-flex align-items-end">
        <div className="w-100">
          <a href="/">
            <ButtonBase className="admin-menu-btn mb-3">Visit website</ButtonBase>
          </a>
          <ButtonBase className="admin-menu-btn" onClick={logout}>
            Logout
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

export default Menu;
