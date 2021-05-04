import Button from "Components/Button";
import { updateDB, getFromDatabase } from "Helper/firebase";
import { refreshAccessToken } from "Helper/instagram";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";

const useStyles = makeStyles({
  instaContainer: {
    background: "black",
    borderRadius: 18,
    maxWidth: 600,
    width: "100%",
    padding: 30,
  },

  input: {
    width: "100%",
    padding: "3px 5px",
    fontSize: "16",
    color: "white",
    background: "#222222",
    borderRadius: 4,
    outline: "none",
    border: "none",
    "&:disabled": {
      background: "transparent",
      padding: 0,
    },
  },

  label: {
    textTransform: "uppercase",
    color: "#717171",
    fontSize: 12,
  },
});

const Discounts = () => {
  const [token, setToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(null);
  const classes = useStyles();
  const [editToken, setEditToken] = useState(false);

  useEffect(() => {
    (async () => {
      let igToken = await getFromDatabase("igAccessToken");
      setToken(igToken ? igToken.token : "");
      setExpiresIn(igToken ? igToken.expiresIn : null);
    })();
  }, []);

  return (
    <div className="w-100 pb-5">
      <div className="d-flex justify-content-between flex-wrap align-items-center mb-5">
        <div className="admin-page-title">Instagram</div>
      </div>
      <div className="" style={{ maxWidth: 800 }}>
        <div className={classes.instaContainer}>
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1 pr-3">
              <div className="d-flex align-items-center">
                <div className={classes.label + " mr-3"}>ACCESS TOKEN</div>
              </div>

              <input
                disabled={!editToken}
                className={classes.input + " text-truncate"}
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              ></input>
              <div className="d-flex justify-content-end">
                <a
                  style={{ fontSize: 12, lineHeight: 1 }}
                  target="_blank"
                  href="https://medium.com/the-innovation/embed-your-instagram-feed-in-2020-68cefb93c650"
                  className="text-yellow mt-1"
                >
                  HOW TO GENERATE?
                </a>
              </div>
            </div>
            {editToken ? (
              <ButtonBase
                className="resource-outlined-btn"
                onClick={() => {
                  updateDB({ "igAccessToken/token": token });
                  setEditToken(false);
                }}
              >
                SAVE
              </ButtonBase>
            ) : (
              <ButtonBase
                className="resource-outlined-btn"
                onClick={() => {
                  setEditToken(true);
                }}
              >
                SET
              </ButtonBase>
            )}
          </div>
          <div className="mb-4">
            <div className={classes.label}>EXPIRES IN</div>
            <input
              disabled
              className={classes.input + " text-truncate"}
              type="text"
              value={expiresIn ? moment(new Date(expiresIn)).format("YYYY-MM-DD") : "Token not set"}
              onChange={() => {}}
            ></input>
          </div>
          <div style={{ maxWidth: 141, width: "100%" }}>
            <Button
              onClick={async () => {
                if (token) {
                  const newToken = await refreshAccessToken(token);
                  setToken(newToken.access_token);
                  setExpiresIn(Date.now() + newToken.expires_in * 1000);
                  updateDB({
                    igAccessToken: {
                      token: newToken.access_token,
                      expiresIn: Date.now() + newToken.expires_in * 1000,
                    },
                  });
                }
              }}
            >
              REFRESH
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
