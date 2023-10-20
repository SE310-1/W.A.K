import { useState } from "react";
import { useLogin } from "../../Hooks/useLogin.js";
import { GOOGLE_CLIENT_ID } from "../../../env.js";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React from "react";
import "./style.css";
import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook } from "reactjs-social-login";

import backgroundImage from "./img/movies.jpeg";
import React from "react";

const Index = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if username or password fields are empty and set validation error if true
    if (username.trim() === "" || password.trim() === "") {
      setValidationError("Please enter your credentials to login");
      return;
    } else {
      setValidationError("");
    }
    await login(username, password);
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    console.log(credentialResponse.credential);
    alert("Signed in with Google");
  };

  return (
    <div className="home-container-login">
      <div
        className="background-image-login"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="overlay-login"></div>
      <div className="login-page">
        <form className="login" onSubmit={handleSubmit}>
          <h3>Log In</h3>

          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />;
          </GoogleOAuthProvider>


          <label>Username:</label>
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

          <button className="login-button" disabled={isLoading}>
            Log in
          </button>
          {validationError && <div className="error">{validationError}</div>}
          {error && <div className="error">{error}</div>}

          <LoginSocialFacebook
            appId="1030308514679380" 
            
            onResolve= {(response) => {
              console.log(response);
            }}
            onReject= {(error) => {
              console.log(error);
            }}

            >
            <FacebookLoginButton />
          </LoginSocialFacebook>
        </form>
      </div>
    </div>
  );
};

export default Index;
