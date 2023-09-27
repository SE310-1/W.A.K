// Importing required dependencies and hooks
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Defining a custom hook 'useLogin'
export const useLogin = () => {
    // Initializing state for error and loading indicators
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Destructuring dispatch from the context to dispatch actions
    const { dispatch } = useAuthContext();

    // Defining the login function which takes username and password as parameters
    const login = async (username, password) => {
        // Setting the loading state to true when login starts
        setIsLoading(true);
        // Resetting any previous errors
        setError(null);

        try {
            // Sending a POST request to the login endpoint with the username and password
            const response = await fetch(
                `${import.meta.env.VITE_BASE_API_URL}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            const json = await response.json();

            if (response.ok) {
                // If response is OK, storing user data to localStorage
                // and dispatching LOGIN action with received user data
                localStorage.setItem("user", JSON.stringify(json));
                dispatch({ type: "LOGIN", payload: json });
            } else {
                // If response is not OK, setting the error state with the error message
                setError(json.error);
            }
        } catch (err) {
            // Handling unexpected errors
            setError(err.message);
        } finally {
            // Setting loading state to false in finally block
            // to ensure it gets executed whether the try block throws an error or not
            setIsLoading(false);
        }
    };

    // Returning login function along with isLoading and error states
    return { login, isLoading, error };
};
