import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffbd1b",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffbd1b",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffbd1b",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: (props) => props.color,
    },
  },
});

const CustomTextField = ({ label, value, onChange, color = "black", ...rest }) => {
  const classes = useStyles({ color });
  return (
    <TextField
      {...rest}
      spellCheck={false}
      variant="outlined"
      label={label}
      fullWidth
      className={classes.root}
      FormHelperTextProps={{
        style: {
          position: "absolute",
          right: 0,
        },
      }}
      InputProps={{
        style: {
          color,
        },
      }}
      InputLabelProps={{
        style: { color },
      }}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomTextField;
