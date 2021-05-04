import "../../Styles/css/login.css";
import Logo from "Assets/images/logo/logo2r.png";
import CustomTextField from "Components/CustomTextField";
import { useState, useEffect } from "react";
import Button from "Components/Button";
import firebase from "FirebaseApp";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const CreateAccount = ({ email, password, onSuccess, onError }) => {
  const db = firebase.database();
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in

      var user = userCredential.user;

      db.ref("admin")
        .get()
        .then((snap) => {
          if (!snap.val()) {
            db.ref()
              .update({ admin: user.uid })
              .then(() => {
                onSuccess({ ...user, isAdmin: true });
              });
          } else {
            onSuccess(user);
          }
        });
    })
    .catch((error) => {
      console.log("Eror", error.message);
      onError(error);
    });
};

const Signup = ({ setUser }) => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const { values, errors, handleSubmit, handleChange, submitCount } = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().typeError("Wrong format").required("Required"),
      password: yup.string().min(6, "Minimum 6 characters"),
      confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (vals) => {
      const onSuccess = (user) => {
        setUser(user);
        if (user.isAdmin) {
          history.push("/admin");
        } else {
          history.push("/");
        }
      };
      const onError = (er) => {
        setError(er.message);
      };
      CreateAccount({ ...vals, onSuccess, onError });
    },
  });

  useEffect(() => {
    setError(null);
  }, [submitCount]);

  return (
    <div
      className="position-fixed w-100 h-100 d-flex overflow-auto p-4"
      style={{ left: 0, top: 0 }}
    >
      <div
        className="position-absolute w-100 h-100 d-block d-sm-none"
        style={{ left: 0, top: 0, background: "black" }}
      ></div>
      <form onSubmit={handleSubmit} className="login-container p-5 m-auto position-relative">
        <div className="d-flex justify-content-center mb-5 pb-4">
          <a href="/">
            <img src={Logo} className="mx-auto" width={198}></img>
          </a>
        </div>
        <div className="px-sm-4">
          <div className="mb-4">
            <CustomTextField
              error={submitCount > 0 && errors["email"]}
              helperText={errors["email"]}
              name="email"
              onChange={handleChange}
              value={values.email}
              label="Email"
              type="email"
              color="white"
            ></CustomTextField>
          </div>
          <div className="mb-4">
            <CustomTextField
              error={submitCount > 0 && errors["password"]}
              helperText={errors["password"]}
              value={values.password}
              onChange={handleChange}
              label="Password"
              type="password"
              name="password"
              color="white"
            ></CustomTextField>
          </div>
          <div>
            <CustomTextField
              error={submitCount > 0 && errors["confirmPassword"]}
              helperText={errors["confirmPassword"]}
              value={values.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              color="white"
            ></CustomTextField>
          </div>
        </div>
        <div
          style={{ height: 75, opacity: error ? 1 : 0 }}
          className="d-flex align-items-end text-danger p-4"
        >
          {error}
        </div>
        <div className="d-flex justify-content-center mb-3">
          <div style={{ maxWidth: 230, width: "100%" }}>
            <Button type="submit">Sign Up</Button>
          </div>
        </div>
        <div
          style={{ color: "white", textAlign: "center", cursor: "pointer" }}
          onClick={() => history.push("/login")}
        >
          Login
        </div>
      </form>
    </div>
  );
};

export default Signup;
