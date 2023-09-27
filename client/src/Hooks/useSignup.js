// Importing required hooks and context
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Defining the useSignup custom hook
export const useSignup = () => {
    // Initializing state variables for error and loading status
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    // Accessing the dispatch method from the authentication context
    const { dispatch } = useAuthContext();

    // Defining the signup function with email, username, and password as parameters
    const signup = async (email, username, password) => {
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
        if (!response.ok) {
            // If response status is not OK, set loading to false and update error state
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // If signup is successful, store user data in local storage and update the context
            localStorage.setItem("user", JSON.stringify(json));
            dispatch({ type: "LOGIN", payload: json });
            // Setting loading status to false after successful signup
            setIsLoading(false);
        }
    };

    // Returning the signup function along with isLoading and error state
    return { signup, isLoading, error };
};
