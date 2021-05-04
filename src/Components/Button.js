import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    background: "#ffbd1b",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#DAA520",
      color: "#FFF",
    },
  },
});

const _Button = (props) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      className={classes.button}
      size={props.size ? props.size : "large"}
      fullWidth
      {...props}
    ></Button>
  );
};

export default _Button;
