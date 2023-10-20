import { useState } from "react";
import { useSignup } from "../../Hooks/useSignup.js";
import "./style.css";
import backgroundImage from "./img/movies.jpeg";
import React from "react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, username, password);
  };

  return (
    <div className="home-container-login">
      <div
        className="background-image-signup"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="overlay-login"></div>
      <div className="login-page">
        <form className="signup" onSubmit={handleSubmit}>
          <h3>Sign Up</h3>

          <label>Email address:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label>User Name:</label>
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            value={username}
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button className="button-13" disabled={isLoading}>
            Sign up
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Index;
