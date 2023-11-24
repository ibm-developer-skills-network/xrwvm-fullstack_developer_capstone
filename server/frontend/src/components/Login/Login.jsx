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
    if (json.status != null && json.status === "Authenticated") {
        sessionStorage.setItem('username', json.userName);
        window.location.reload();
    }
    else {
      alert("The user could not be authenticated.")
    }
};

const logout = async (e) => {
//Include the code for logout here.
};
  
//The default home page items are the login details panel
let home_page_items =  
  <div className="input_panel">
    <form onSubmit={login}>
        <input type="text"  name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)}/>            
        <input name="psw" type="password"  placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)}/>            
        <input className="submit_button" type="submit" value="Login"/>
        <a className="nav_item" href="/register">Register</a>
    </form>
  </div>
//Gets the username in the current session
let curr_user = sessionStorage.getItem('username')

//If the user is logged in, show the username and logout option on home page
if ( curr_user !== null &&  curr_user !== "") {
    home_page_items = <div className="input_panel">
    <text className="username">
      {sessionStorage.getItem("username")}
    </text>            
    <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
  </div>
}
    return (
        <div>
        <div className="navcontainer">
            <div className='navitems'>
            <text className="small_header">Dealership Reviews</text>
  
              <a className="nav_item" href="/">Home</a>
              <a className="nav_item" href="/about">About Us</a>
              <a className="nav_item" href="/contact">Contact Us</a>
            </div>
            {home_page_items}
          </div>
        </div>
    )
}

export default Login
