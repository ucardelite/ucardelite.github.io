import Logo from "Assets/images/logo/logo2r.png";
import Button from "Components/Button";

const OrderCancelledPage = () => {
  return (
    <div className="position-fixed w-100 h-100 d-flex" style={{ left: 0, top: 0 }}>
      <div
        className="position-absolute w-100 h-100 d-block d-sm-none"
        style={{ left: 0, top: 0, background: "black" }}
      ></div>
      <div className="position-absolute" style={{ top: 20, left: 20, zIndex: 10 }}>
        <img src={Logo} width={198}></img>
      </div>
      <div
        className="m-auto text-white text-center position-relative"
        style={{ background: "black", borderRadius: 11, padding: 79, zIndex: 2 }}
      >
        <div style={{ minHeight: 267 }} className="d-flex flex-column justify-content-between">
          <div style={{ fontSize: 48, maxWidth: 313 }}>Something went wrong...</div>
          <a href="/">
            <Button>GO TO HOME PAGE</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelledPage;
