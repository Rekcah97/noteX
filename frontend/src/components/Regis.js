import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Regis = (props) => {
  const host = process.env.REACT_APP_BACKEND_URL;
  const { showAlert } = props;
  let history = useHistory();
  const [Credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    conpassword: "",
  });
  const handleSubmit = async (e) => {
    const { name, email, password, conpassword } = Credential;
    e.preventDefault();

    if (conpassword !== password) {
      showAlert("Confirm password doesn't match", "danger");
      return;
    }
    const response = await fetch(`${host}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email: email.toLowerCase(), password }),
    });
    const json = await response.json();
    console.log("SIGNUP RESPONSE:", json);

    if (json.success) {
      localStorage.setItem("token", json.auth);
      localStorage.setItem("name", Credential.name);
      localStorage.setItem("verifiedStatus", "false");

      history.push("/verifyemail");
      showAlert("Your Account was created Successfully", "success");
    } else {
      showAlert("user with this email already exists.", "danger");
    }
  };

  const onChange = (e) => {
    setCredential({ ...Credential, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="acontainer">
          <div className="text">
            <h1>Register</h1>
            <p>Please fill in this form to Register your Account</p>
          </div>
          <div className="border-bottom border-top pd-3 ainputcontainer">
            <label htmlFor="name" className="mt-3 ">
              <b>Name</b>
            </label>

            <input
              type="text"
              placeholder="Enter Your Full Name "
              name="name"
              value={Credential.name}
              id="name"
              onChange={onChange}
              aria-describedby="nameHelp"
              required
              className="ainput"
            />

            <label htmlFor="email">
              <b>Email</b>
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={Credential.email}
              id="email"
              onChange={onChange}
              aria-describedby="emailHelp"
              required
              className="ainput"
            />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={Credential.password}
              onChange={onChange}
              id="password"
              className="ainput mb-3"
              minLength={5}
              required
            />
            <label htmlFor="conpassword">
              <b>Confirm Password</b>
            </label>
            <input
              type="password"
              placeholder="Re-enter Password"
              name="conpassword"
              value={Credential.conpassword}
              onChange={onChange}
              id="conpassword"
              className="ainput mb-3"
              minLength={5}
              required
            />
          </div>
          <p className="my-3 ">
            By Registering your Account you Agree to our{" "}
            <NavLink to="/termprivacy">Terms & Privacy</NavLink>.
          </p>

          <button type="submit" className="registerbtn">
            SignUp
          </button>
          <div className="signin">
            <p>
              Already have an account? <NavLink to="/login">Login</NavLink>.
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default Regis;
