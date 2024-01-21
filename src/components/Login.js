import { useState, useEffect } from "react";
import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {  signInWithEmailAndPassword } from "firebase/auth"
const Login = () => {

  const [err, setErr] = useState(false);
  const navigate=useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/')
    } catch (err) {
      setErr(true);
    }
  };
  
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setDisplay(false);
    const timeoutId = setTimeout(() => {
      setDisplay(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div
      className="register"
      style={{
        transform: display ? "translateY(0%)" : "translateY(200%)",
        transition: "all 0.5s",
      }}
    >
      <h1 className="logo">
        <span>
          <i>ChatSphere</i>
        </span>
      </h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          
        />
        <input
          type="password"
          placeholder="Enter password"
          
        />
        <button>Login</button>
        {err && <span>Something went wrong</span>}
      </form>
      
      <h4>
        Not Yet Registered!
        <Link className="link" to="/register">
          Register
        </Link>
      </h4>
    </div>
  );
};

export default Login;
