import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import "../../Styles/css/dialog.css";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import md5 from "md5";
import { updateDB } from "Helper/firebase";
import { v4 as uuidv4 } from "uuid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import * as yup from "yup";
import ToggleButtonContainer from "Components/ToggleButton";
import firebase from "FirebaseApp";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  pay: {
    background:
      "linear-gradient(94deg, rgba(191,149,63,1) 10%, rgba(255,248,183,1) 50%, rgba(191,149,63,1) 90%)",
    color: "rgba(0, 0, 0, 0.74)",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
    "&:hover": {
      backgroundColor: "#DAA520",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  handleClose,
  data,
  totalAmount,
  setShippingPrice,
  setInsurancePrice,
  setDiscount,
  discount,
}) {
  const formEl = useRef();

  const createOrderIntent = (vals) => {
    updateDB({
      ["orders/" + values.m_payment_id]: {
        ...vals,
        cardDetails: {
          provider: data.cardNumberType,
          numberOnFront: data.cardNumberPosition === "front",
          logoText: data.customText,
          logoTextSize: data.textSize,
          name: data.primaryName,
        },
      },
    });
  };

  const { values, errors, handleChange, handleSubmit, submitCount, setFieldValue } = useFormik({
    initialValues: {
      name_first: "",
      name_last: "",
      email_address: "",
      address: "",
      city: "",
      state: "",
      m_payment_id: uuidv4(),
      shipping: "",
      insurance: false,
    },
    validationSchema: yup.object().shape({
      name_first: yup.string().required("Required"),
      name_last: yup.string().required("Required"),
      email_address: yup.string().email().required("Required"),
      address: yup.string().required("Required"),
      city: yup.string().required("Required"),
      state: yup.string().required("Required"),
      shipping: yup.string().required("Required"),
    }),
    onSubmit: (val) => {
      createOrderIntent(val);
      formEl.current.submit();
    },
  });

  const shippingTypes = {
    local: {
      value: "local",
      label: "Local Shipping (South Africa Only)",
      options: [
        { label: "Free Standard Shipping", value: "local standard", price: 0 },
        { label: "Express Shipping", value: "local express", price: 250 },
      ],
    },
    rest: {
      value: "rest",
      label: "Rest Of World",
      options: [
        { label: "Standard Shipping", value: "rest standard", price: 300 },
        { label: "Express Shipping", value: "rest express", price: 550 },
      ],
    },
  };

  const [shippingType, setShippingType] = useState("local");
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    setFieldValue("shipping", shippingTypes[shippingType].options[0].value);
  }, [shippingType]);

  useEffect(() => {
    if (values.shipping) {
      setShippingPrice(
        shippingTypes[shippingType].options.find((x) => x.value === values.shipping).price
      );
    }
  }, [values.shipping]);

  useEffect(() => {
    setInsurancePrice(values.insurance ? 850 : 0);
  }, [values.insurance]);

  const searchDiscount = async () => {
    let results = await firebase.database().ref("discounts").get();
    if (results.val()) {
      const discountMatch = Object.values(results.val()).find((x) => x.code === discountCode);
      if (discountMatch) {
        setDiscount(-discountMatch.discount);
      } else {
        setDiscount(0);
      }
    }
  };

  const classes = useStyles();
  const formData = new URLSearchParams({
    merchant_id: 17328503,
    merchant_key: "nj056x4f79tnn",
    return_url: window.location.origin + "/order-success",
    cancel_url: window.location.origin + "/order-cancelled",
    notify_url: process.env.REACT_APP_API_URL + "/api/acceptPayment",
    name_first: values.name_first,
    name_last: values.name_last,
    email_address: values.email_address,
    m_payment_id: values.m_payment_id,
    amount: totalAmount,
    item_name: "uCard Elite customized card",
  });

  const valuesString = formData.toString();
  const signature = md5(valuesString);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Invoice Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <form method="POST" ref={formEl} action="https://www.payfast.co.za/eng/process">
              <div className="row dialog-upper">
                <div className="col-md-8 mb-3 mb-md-0">
                  <TextField
                    label="Discount Code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    type="text"
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="col-md-4">
                  <Button
                    onClick={searchDiscount}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    className={classes.pay}
                  >
                    Apply
                  </Button>
                </div>
                {discount ? <div className="col-12">{discount} R</div> : null}
                <div className="col-12 mt-4">
                  <Typography
                    className={`mb-3 ${submitCount > 0 && errors["shipping"] ? "text-danger" : ""}`}
                  >
                    Select shipping
                  </Typography>
                  <div className="options-group mb-3">
                    <ToggleButtonContainer
                      data={Object.values(shippingTypes)}
                      getOptions={(val) => setShippingType(val)}
                      defaultValue={shippingType}
                    />
                  </div>
                  <RadioGroup
                    aria-label="gender"
                    name="shipping"
                    value={values.shipping}
                    onChange={handleChange}
                  >
                    {shippingTypes[shippingType].options.map((x, i) => (
                      <FormControlLabel
                        value={x.value}
                        control={<Radio />}
                        label={x.label + " " + (x.price === 0 ? "" : "R " + x.price)}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className="mt-3 col-12">
                  <Typography className="mb-3">Insurance</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.insurance}
                        onChange={handleChange}
                        name="insurance"
                      />
                    }
                    label="If card is lost or if it expires in the first 365 days, we’ll replace it just pay the shipping costs (R 850)"
                  />
                </div>
                {data.borderIndicator && data.borderIndicator.image !== "none" ? (
                  <div className="order mt-5">
                    <div className="order-item">
                      <Typography>Border</Typography>
                      <Typography>R {data.borderIndicator.price || 0} +</Typography>
                    </div>
                  </div>
                ) : null}
                <div className="order">
                  <div className="order-item">
                    <Typography>Total</Typography>
                    <Typography>R{totalAmount}</Typography>
                  </div>
                </div>
              </div>
              <input type="hidden" name="merchant_id" value={formData.get("merchant_id")}></input>
              <input type="hidden" name="merchant_key" value={formData.get("merchant_key")}></input>
              <input type="hidden" name="return_url" value={formData.get("return_url")}></input>
              <input type="hidden" name="cancel_url" value={formData.get("cancel_url")}></input>
              <input type="hidden" name="notify_url" value={formData.get("notify_url")}></input>
              <div className="row mt-4 px-3">
                <div className="col-md-6 mb-4 mb-md-0">
                  <TextField
                    required
                    error={submitCount > 0 && errors["name_first"]}
                    helperText={submitCount > 0 ? errors["name_first"] : ""}
                    value={values.name_first}
                    label="First Name"
                    name="name_first"
                    onChange={handleChange}
                    type="text"
                    fullWidth
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    required
                    error={submitCount > 0 && errors["name_last"]}
                    helperText={submitCount > 0 ? errors["name_last"] : ""}
                    value={values.name_last}
                    label="Last Name"
                    name="name_last"
                    onChange={handleChange}
                    type="text"
                    fullWidth
                  />
                </div>
                <div className="col-12 mt-4">
                  <TextField
                    required
                    label="Email"
                    type="email"
                    name="email_address"
                    value={values.email_address}
                    onChange={handleChange}
                    error={submitCount > 0 && errors["email_address"]}
                    helperText={submitCount > 0 ? errors["email_address"] : ""}
                    fullWidth
                  />
                </div>
              </div>
              <input type="hidden" name="m_payment_id" value={formData.get("m_payment_id")}></input>
              <input type="hidden" name="amount" value={formData.get("amount")}></input>
              <input type="hidden" name="item_name" value={formData.get("item_name")}></input>
              <input type="hidden" name="signature" value={signature}></input>
            </form>
            <div className="px-3">
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    required
                    value={values.address}
                    onChange={handleChange}
                    error={submitCount > 0 && errors["address"]}
                    helperText={submitCount > 0 ? errors["address"] : ""}
                    label="Address"
                    name="address"
                    fullWidth
                    type="text"
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6 mb-4 mb-md-0">
                  <TextField
                    required
                    value={values.city}
                    onChange={handleChange}
                    error={submitCount > 0 && errors["city"]}
                    helperText={submitCount > 0 ? errors["city"] : ""}
                    label="City"
                    name="city"
                    fullWidth
                    type="text"
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    required
                    value={values.state}
                    onChange={handleChange}
                    error={submitCount > 0 && errors["state"]}
                    helperText={submitCount > 0 ? errors["state"] : ""}
                    label="State"
                    name="state"
                    fullWidth
                    type="text"
                  />
                </div>
              </div>
              <div className="row justify-content-lg-center mt-4 pt-2 pb-4">
                <div className="col-md-12">
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    size="large"
                    fullWidth
                    variant="contained"
                    color="secondary"
                  >
                    Pay
                  </Button>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
