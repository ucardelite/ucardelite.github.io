import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import DayPicker from "Components/DayPicker";
import moment from "moment";
import ButtonBase from "@material-ui/core/ButtonBase";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  container: {
    background: "black",
    color: "white",
    borderRadius: 18,
    position: "relative",
    maxWidth: "100vw",
  },
  code: {
    background: "#222222",
    borderRadius: 7,
    fontSize: 36,
    textAlign: "center",
    padding: "5px 20px",
    outline: "none",
    border: "none",
    color: "white",
    width: "100%",

    "&:disabled": {
      background: "transparent",
    },
  },
  label: {
    textTransform: "uppercase",
    color: "#717171",
    fontSize: 12,
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
});

const DiscountCard = ({ discount, onUpdate, onDelete }) => {
  const classes = useStyles();
  const [values, setValues] = useState({ code: "", discount: "", start: "", end: "" });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setValues(discount);
    if (discount.code === "empty") {
      setEdit(true);
    }
  }, [discount]);

  return (
    <div className={classes.container + " p-4"}>
      <div className="position-absolute" style={{ top: 15, right: 15 }}>
        {edit ? (
          <ButtonBase
            className="resource-outlined-btn"
            onClick={() => {
              onUpdate(values);
              setEdit(false);
            }}
          >
            SAVE
          </ButtonBase>
        ) : (
          <ButtonBase className="resource-outlined-btn" onClick={() => setEdit(true)}>
            EDIT
          </ButtonBase>
        )}
      </div>
      {edit ? (
        <DeleteIcon
          onClick={onDelete}
          className="position-absolute delete-icon"
          style={{ top: 15, left: 15, fontSize: 28, cursor: "pointer" }}
          fontSize="inherit"
        ></DeleteIcon>
      ) : null}
      <div className="pb-4 pt-4 d-flex justify-content-center">
        <input
          type="text"
          className={classes.code}
          disabled={!edit}
          value={values.code === "empty" ? "" : values.code}
          onChange={(e) => setValues((prev) => ({ ...prev, code: e.target.value }))}
          placeholder="ENTER CODE"
        ></input>
      </div>
      <div className="d-flex justify-content-center">
        <div className="mr-3">
          <div className={classes.label}>Discount</div>
          <input
            disabled={!edit}
            className={classes.input}
            placeholder="Enter"
            value={values.discount === "empty" ? "" : values.discount}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                {
                  setValues((prev) => ({ ...prev, discount: val }));
                }
              }
            }}
            type="text"
          ></input>
        </div>
        <div className="mr-3">
          <div className={classes.label}>Start date</div>
          <DayPicker
            disabled={!edit}
            value={values.start}
            setValue={(day) => setValues((prev) => ({ ...prev, start: day }))}
          >
            <input
              disabled={!edit}
              placeholder="Select"
              className={classes.input}
              value={values.start === "empty" ? "" : moment(values.start).format("YYYY-MM-DD")}
              type="text"
            ></input>
          </DayPicker>
        </div>
        <div>
          <div className={classes.label}>End date</div>
          <DayPicker
            disabled={!edit}
            value={values.end}
            setValue={(day) => setValues((prev) => ({ ...prev, end: day }))}
          >
            <input
              disabled={!edit}
              placeholder="Select"
              className={classes.input}
              value={values.end === "empty" ? "" : moment(values.end).format("YYYY-MM-DD")}
              type="text"
            ></input>
          </DayPicker>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;
