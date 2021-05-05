import React, { useEffect, useState } from "react";
import "../../Styles/css/order.css";
import FrontCard from "../../Components/FrontCard";
import BackCard from "../../Components/BackCard";
import ControlPanel from "./ControlPanel";
import M3 from "../../Assets/images/card/m3.jpg";
import { sendCards } from "Services";
import Button from "Components/Button";
import TextField from "@material-ui/core/TextField";

function Order() {
  const [customCard, setCustomCard] = useState();
  const [activeBackground, setActiveBackground] = useState();
  const [email, setEmail] = useState("");
  const [buttonVal, setButtonVal] = useState("Look up cards");

  const handleValue = (value) => {
    setCustomCard((prev) => ({ ...prev, ...value }));
  };

  const handleCardsLookup = async () => {
    setButtonVal("Loading...");
    let finalLogo = null;
    if (customCard.logo) {
      finalLogo = customCard.logo;
      finalLogo.setAttribute("width", customCard.logoWidth / 5.557);
      finalLogo.setAttribute("height", customCard.logoHeight / 5.557);
      finalLogo = finalLogo.outerHTML;
    }

    const response = await sendCards({
      name: customCard.primaryName,
      email,
      provider: customCard.cardNumberType,
      numberPosition: customCard.cardNumberPosition,
      logoText: customCard.customText,
      logoTextX: customCard.logoTextX,
      logoTextY: customCard.logoTextY,
      logoTextSize: customCard.textSize,
      logo: finalLogo,
      logoX: customCard.logoX,
      logoY: customCard.logoY,
      logoWidth: customCard.logoWidth,
      logoHeight: customCard.logoHeight,
      border: customCard.borderIndicator ? customCard.borderIndicator.image : null,
    });
    setButtonVal("Email sent!");
    setTimeout(() => {
      setButtonVal("Look up cards");
    }, 2000);
  };

  useEffect(() => {
    if (customCard && customCard.backgroundIndicator) {
      const back = customCard.backgroundIndicator;

      setActiveBackground(back);
    }
  }, [customCard]);

  return (
    <div className="row order-container">
      <div className="col-md-5">
        <div className="bg-white p-3 align-items-center mb-3">
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="filled-secondary"
            className="mb-3"
            label="Email"
            fullWidth
          />
          <div className="d-flex justify-content-end">
            <div style={{ maxWidth: 200, width: "100%" }}>
              <Button onClick={handleCardsLookup}>{buttonVal}</Button>
            </div>
          </div>
        </div>
        <FrontCard
          setData={(update) => setCustomCard((prev) => ({ ...prev, ...update }))}
          data={customCard}
          background={activeBackground || { image: M3 }}
        />
        <BackCard data={customCard} background={activeBackground || { image: M3 }} />
      </div>
      <div className="col-md-7">
        <ControlPanel getValue={handleValue} />
      </div>
    </div>
  );
}

export default Order;
