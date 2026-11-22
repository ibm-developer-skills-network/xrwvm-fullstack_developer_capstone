import React from 'react';

import "./Register.css";
import Header from '../Header/Header';

const Register = () => {
  const register = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const res = await fetch("/djangoapp/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": values.userName,
        "password": values.password,
        "firstName": values.firstName,
        "lastName": values.lastName,
        "email": values.email,
      }),
    });

    const json = await res.json();
    if (json.status) {
      sessionStorage.setItem("username", json.userName);
      window.location.href = "/";
    } else {
      alert(json.error || "The user could not be registered.");
    }
  };

  return (
    <div>
      <Header />
      <form className="register_container" onSubmit={register}>
        <h1 className="header">Register</h1>
        <div className="inputs">
          <div className="input">
            <input type="text" name="firstName" placeholder="First Name" className="input_field" required />
          </div>
          <div className="input">
            <input type="text" name="lastName" placeholder="Last Name" className="input_field" required />
          </div>
          <div className="input">
            <input type="text" name="userName" placeholder="Username" className="input_field" required />
          </div>
          <div className="input">
            <input type="email" name="email" placeholder="Email" className="input_field" required />
          </div>
          <div className="input">
            <input type="password" name="password" placeholder="Password" className="input_field" required />
          </div>
          <div className="input">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input_field" required />
          </div>
        </div>
        <div className="submit_panel">
          <input className="submit" type="submit" value="Register" />
          <a className="loginlink" href="/login">Already registered? Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
