import React from "react";
import "../../Styles/css/home.css";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import TermsAndConditions from "Components/TermsAndConditions";

function Home() {
  return (
    <>
      <div class="main">
        <div className="cardNButton">
          <div className="landing-card-container">
            <div className="landing-chip"></div>
            <div className="landing-logo">
              <div>Your</div>
              <div>Logo</div>
              <div>Here</div>
            </div>
            <div className="landing-card-number">
              <span>7777 7777 7777 7777</span>
              <span className="landing-valid">Valid SAT 77/77</span>
            </div>
          </div>
          <div className="landing-card-container card-1">
            <div className="landing-chip"></div>
            <div className="landing-logo">
              <div>Your</div>

              <div>Logo</div>
              <div>Here</div>
            </div>
            <div className="landing-card-number">
              <span>7777 7777 7777 7777</span>
              <span className="landing-valid">Valid SAT 77/77</span>
            </div>
          </div>
          <div className="home-button">
            <Button component={Link} to="/order" size="large" variant="outlined" color="default">
              Customize Your Own Card
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
