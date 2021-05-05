import React from "react";
import "../Styles/css/card.css";
import Draggable from "react-draggable";
import { ReactComponent as VisaIcon } from "Assets/images/card/visa.svg";
import { ReactComponent as MastercardIcon } from "Assets/images/card/mastercard.svg";

function FrontCard({ data, background, setData }) {
  const [state, setState] = React.useState({
    activeDrags: 0,
  });

  const onStart = () => {
    setState((prev) => ({ ...prev, activeDrags: ++state.activeDrags }));
  };

  const onStop = () => {
    setState((prev) => ({ ...prev, activeDrags: --state.activeDrags }));
  };

  const dragHandlers = { onStart: onStart, onStop: onStop };

  let divStyle = {
    backgroundImage: "url(" + background.image || "" + ")",
    backgroundSize: "cover",
  };

  let imageStyle = {
    height: `${data?.logoHeight}px`,
    width: `${data?.logoWidth}px`,
    fontSize: 0,
    position: "absolute",
  };

  return (
    <div className="card-container position-relative overflow-hidden" style={divStyle}>
      {data && data.borderIndicator && data.borderIndicator.image !== "none" ? (
        <div className="position-absolute" style={{ top: 3, left: 3, bottom: 3, right: 3 }}>
          <img src={data.borderIndicator.image} className="position-absolute img-border" />
        </div>
      ) : null}
      <Draggable
        onDrag={(e, node) => {
          setData({ logoX: node.x, logoY: node.y });
        }}
        {...dragHandlers}
      >
        <div>
          <div>
            {/* <div id="logo-container" className="position-absolute d-flex" style={imageStyle}></div> */}
            <canvas style={imageStyle} id="logo-canvas"></canvas>
          </div>
          {/* <img draggable={false} src={data && data?.logo} style={imageStyle} /> */}
        </div>
      </Draggable>
      {data && data.customText && (
        <Draggable
          onDrag={(e, node) => {
            setData({ logoTextX: node.x, logoTextY: node.y });
          }}
          {...dragHandlers}
        >
          <div
            className="d-inline-flex position-absolute text-white"
            style={{ fontSize: `${data.textSize + "px"}`, left: 10, top: 10 }}
          >
            {data.customText}
          </div>
        </Draggable>
      )}
      <div className="position-absolute" style={{ left: 47, top: 108 }}>
        <span className="small-chip"></span>
      </div>
      <div
        className="position-absolute text-center text-white card-number"
        style={{ top: 163.61, left: 0, right: 0 }}
      >
        {data?.cardNumberPosition === "front" && (
          <>
            <Draggable {...dragHandlers}>
              <div>7777 7777 7777 7777</div>
            </Draggable>
            <div className="card-valid-number">
              <Draggable {...dragHandlers}>
                <div>Valid 77/77</div>
              </Draggable>
            </div>
          </>
        )}
      </div>
      <div className="position-absolute" style={{ bottom: 12, left: 17 }}>
        <Draggable {...dragHandlers}>
          <div className="cardholder-name text-white">{data?.primaryName || "(Name Here)"}</div>
        </Draggable>
      </div>
      <div className="position-absolute" style={{ bottom: 12, right: 17 }}>
        <Draggable {...dragHandlers}>
          <div>
            {data ? (
              data.cardNumberType === "visa" ? (
                <VisaIcon fill="white" width="65px" height="28px" />
              ) : data.cardNumberType === "mastercard" ? (
                <MastercardIcon fill="white" width="65px" height="45px" />
              ) : null
            ) : null}
          </div>
        </Draggable>
      </div>
    </div>
  );
}

export default FrontCard;
