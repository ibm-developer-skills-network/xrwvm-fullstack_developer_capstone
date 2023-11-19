import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import user_icon from "../assets/person.png"
import password_icon from "../assets/password.png"
import "./Login.css";



const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf(window.location.path));
  let login_url = root_url+"djangoapp/login";
  let logout_url = root_url+"djangoapp/logout";

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(login_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": userName,
            "password": password
        }),
    });
    
    const json = await res.json();
    if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('username', json.userName);
        window.location.reload();
    }
    else {
      alert("The user could not be authenticated.")
    }
};

const logout = async (e) => {
  e.preventDefault();

  const res = await fetch(logout_url, {
      method: "GET",
  });
  
  const json = await res.json();
  if (json) {
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('username');
      window.location.reload();
  }
  else {
    alert("The user could not be logged out.")
  }
};

    return (
      <div>
      <div className="navcontainer">
          <div className='navitems'>
          <text className="small_header">Dealership Reviews</text>

            <a className="nav_item" href="/djangoapp">Home</a>
            <a className="nav_item" href="/djangoapp/about">About Us</a>
            <a className="nav_item" href="/djangoapp/contact">Contact Us</a>
          </div>
          <div className="input_panel">
            <text className="username">
              Username
            </text>            
            <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
          </div>

        </div>
          <text className="small_header">Dealership Reviews</text>
          </div>
          )
}

export default Login