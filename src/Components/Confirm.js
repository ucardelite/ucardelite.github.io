import { confirmable, createConfirmation } from "react-confirm";
import Button from "Components/Button";
import OutlinedButton from "Components/OutlinedButton";
import { useState } from "react";

const Confirm = ({ question = "Do you agree to complete the action?", proceed }) => {
  const [show, setShow] = useState(true); // for some reason after cancelling, popup closes with delay.
  return show ? (
    <div
      onClick={() => {
        proceed(false);
        setShow(false);
      }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background: `rgba(0,0,0,0.4)`,
      }}
      className="d-flex overflow-auto p-5"
    >
      <div className="confirm-container p-5 m-auto">
        <h4 className="mb-5 pb-3">{question}</h4>
        <div className="d-flex">
          <div className="mx-1" style={{ maxWidth: 150, width: "100%" }}>
            <Button onClick={() => proceed(true)}>Confirm</Button>
          </div>
          <div className="mx-1" style={{ maxWidth: 150, width: "100%" }}>
            <OutlinedButton onClick={() => proceed(false)} variant="outlined">
              Cancel
            </OutlinedButton>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default createConfirmation(confirmable(Confirm));
