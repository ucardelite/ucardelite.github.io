import "../../Styles/css/login.css";
import Logo from "Assets/images/logo/logo2r.png";
import CustomTextField from "Components/CustomTextField";
import { useEffect, useState } from "react";
import Button from "Components/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import firebase from "FirebaseApp";
import { useHistory } from "react-router-dom";

const login = ({ email, password, onSuccess, onError }) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed inas
      var user = userCredential.user;

      const db = firebase.database();
      db.ref(`admin`)
        .get()
        .then((snap) => {
          let finalUser = { ...user };
          if (snap.val() === user.uid) {
            finalUser.isAdmin = true;
          }
          onSuccess(finalUser);
        });
    })
    .catch((error) => {
      onError(error);
    });
};

const Login = ({ setUser }) => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { values, errors, submitCount, handleSubmit, handleChange } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().typeError("Invalid format").required("Required"),
      password: yup.string().required("Required"),
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
      login({ ...vals, onSuccess, onError });
    },
  });

  useEffect(() => {
    setError(null);
  }, [submitCount]);

  return (
    <div className="position-fixed w-100 h-100 d-flex overflow-auto" style={{ left: 0, top: 0 }}>
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
              name="email"
              error={submitCount > 0 && errors["email"]}
              helperText={errors["email"]}
              value={values.email}
              onChange={handleChange}
              label="Email"
              type="email"
              color="white"
            ></CustomTextField>
          </div>
          <div>
            <CustomTextField
              name="password"
              error={submitCount > 0 && errors["password"]}
              helperText={errors["password"]}
              value={values.password}
              onChange={handleChange}
              label="Password"
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
            <Button type="submit">Login</Button>
          </div>
        </div>
        <div
          style={{ color: "white", textAlign: "center", cursor: "pointer" }}
          onClick={() => history.push("/signup")}
        >
          Create account
        </div>
      </form>
    </div>
  );
};

export default Login;
