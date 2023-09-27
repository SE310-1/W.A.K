import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    // Initializing state variables for error and loading status
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Initial value set to false for consistency

    // Accessing the dispatch method from the authentication context
    const { dispatch } = useAuthContext();

    const signup = async (email, username, password) => {
        try {
            // Setting loading status to true at the start of signup process
            setIsLoading(true);
            // Resetting any previous error state
            setError(null);

            // Sending a POST request to the signup endpoint with user details
            const response = await fetch(
                `${import.meta.env.VITE_BASE_API_URL}/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, username, password }),
                }
            );

            // Parsing the JSON response from the server
            const json = await response.json();

            // Handling the response from the server
            if (response.ok) {
                // If signup is successful, store user data in local storage and update the context
                localStorage.setItem("user", JSON.stringify(json));
                dispatch({ type: "LOGIN", payload: json });
            } else {
                // If response status is not OK, update error state
                setError(json.error);
            }
        } catch (err) {
            // Handle network or other fetch errors
            setError(err.message || "Signup failed");
        } finally {
            // Always set loading to false after handling the response or error
            setIsLoading(false);
        }
    };

    // Returning the signup function along with isLoading and error state
    return { signup, isLoading, error };
};
