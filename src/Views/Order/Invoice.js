import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialogSlide from "./CheckoutModal";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  checkout: {
    background:
      "linear-gradient(94deg, rgba(191,149,63,1) 10%, rgba(255,248,183,1) 50%, rgba(191,149,63,1) 90%)",
    color: "rgba(0, 0, 0, 0.74)",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
    "&:hover": {
      backgroundColor: "#DAA520",
    },
  },
}));

function Invoice({ data }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const priceForBordersAndMetals =
    +(data.borderIndicator.price || 0) + +(data.backgroundIndicator.price || 1499);

  const [shippingPrice, setShippingPrice] = useState(0);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const totalAmount = priceForBordersAndMetals + shippingPrice + insurancePrice + discount;

  return (
    <>
      <AlertDialogSlide
        open={open}
        handleClose={handleClose}
        data={data}
        totalAmount={totalAmount}
        setShippingPrice={setShippingPrice}
        setInsurancePrice={setInsurancePrice}
        setDiscount={setDiscount}
        discount={discount}
      />
      {data.borderIndicator ? (
        <div className="row extra-fac">
          <div>Border</div>
          <div>R {data.borderIndicator.price}</div>
        </div>
      ) : null}
      <div className="row extra-fac">
        <div>Metal</div>
        <div>R {data.backgroundIndicator.price || 1499}</div>
      </div>

      <hr></hr>
      <div className="row">
        <div className="col-md-12 price">
          <div>
            <Button
              variant="contained"
              className={classes.checkout}
              size="large"
              fullWidth
              onClick={handleClickOpen}
            >
              Checkout
            </Button>
          </div>
          <div>Total</div>
          <div>R {totalAmount}</div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
