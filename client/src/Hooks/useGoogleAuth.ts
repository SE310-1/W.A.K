import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { CredentialResponse } from "@react-oauth/google";

// Defining a custom hook for handling Google Auth JWTs on the client side and passing them to the server
export const useGoogleAuth = () => {
  // Initializing state for error and loading indicators
  const [googleAuthError, setGoogleAuthError] = useState("");
  const [googleAuthIsLoading, setGoogleAuthIsLoading] = useState(true);

  // Destructuring dispatch from the context to dispatch actions
  const { dispatch } = useAuthContext();

  // Defining the login function which takes a Google Auth credential response
  const loginWithGoogleJWT = async (credentialResponse: CredentialResponse) => {
    // Setting the loading state to true when login starts
    setGoogleAuthIsLoading(true);
    // Resetting any previous errors
    setGoogleAuthError("");

    // Sending a POST request to the login endpoint with the username and password
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/login_google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleJWT: credentialResponse.credential }),
        }
      );

      // Parse the JSON response
      const json = await response.json();

      if (!response.ok) {
        setGoogleAuthError(
          json.message || "Failed to authenticate with Google"
        );
        return;
      }

      // Log the user in and persist the JWT
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (error) {
      setGoogleAuthError("Unexpected error occurred. Please try again.");
    } finally {
      setGoogleAuthIsLoading(false);
    }
  };

  // Returning login function along with loading and error states
  return { loginWithGoogleJWT, googleAuthIsLoading, googleAuthError };
};
