import React, { useState } from 'react';

import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {

  const [open,setOpen] = useState(true);

  let login_url = window.location.origin+"/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const submittedUserName = form.elements.username.value;
    const submittedPassword = form.elements.psw.value;

    const res = await fetch(login_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": submittedUserName,
            "password": submittedPassword
        }),
    });

    const json = await res.json();
    if (json.status === "Authenticated") {
        sessionStorage.setItem('username', json.userName);
        setOpen(false);
    }
    else {
      sessionStorage.removeItem('username');
      alert("The user could not be authenticated.")
    }
};

  if (!open) {
    window.location.href = "/";
  };
  

  return (
    <div>
      <Header/>
    <div onClick={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
          <form className="login_panel" style={{}} onSubmit={login}>
              <div>
              <span className="input_field">Username </span>
              <input type="text"  name="username" placeholder="Username" className="input_field"/>
              </div>
              <div>
              <span className="input_field">Password </span>
              <input name="psw" type="password"  placeholder="Password" className="input_field"/>
              </div>
              <div>
              <input className="action_button" type="submit" value="Login"/>
              <input className="action_button" type="button" value="Cancel" onClick={()=>setOpen(false)}/>
              </div>
              <a className="loginlink" href="/register">Register Now</a>
          </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
