import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
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
      setUserName('');
      setPassword('');  
      window.location.reload();
  }
  else {
    alert("The user could not be logged out.")
  }
};

  if (sessionStorage.getItem('username')) {
    return (
      <div>
      <div className="navcontainer">
          <div className='navitems'>
          <text className="small_header">Dealership Reviews</text>

            <a className="nav_item" href="/">Home</a>
{/*             <a className="nav_item" href="/about">About Us</a>
            <a className="nav_item" href="/contact">Contact Us</a> */}
          </div>
          <div className="input_panel">
            <text className="username">
              {sessionStorage.getItem("username")}
            </text>            
            <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
          </div>

        </div>
          <text className="small_header">Dealership Reviews</text>
          </div>
          )
    } else {
      return (
        <div>
        <div className="navcontainer">
            <div className='navitems'>
            <text className="small_header">Dealership Reviews</text>
  
              <a className="nav_item" href="/">Home</a>
{/*               <a className="nav_item" href="/about">About Us</a>
              <a className="nav_item" href="/contact">Contact Us</a> */}
            </div>
            <div className="input_panel">
            <form onSubmit={login}>
                <input type="text"  name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)}/>            
                <input name="psw" type="password"  placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)}/>            
                <input className="submit_button" type="submit" value="Login"/>
                <a className="nav_item" href="/register">Register</a>
            </form>
            </div>
  
          </div>
            <text className="small_header">Dealership Reviews</text>
            </div>
            )
    }
}

export default Login
