// Importing required dependencies and hooks
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Defining a custom hook 'useLogin'
export const useLogin = () => {
    // Initializing state for error and loading indicators
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    // Destructuring dispatch from the context to dispatch actions
    const { dispatch } = useAuthContext();

    // Defining the login function which takes username and password as parameters
    const login = async (username, password) => {
        // Setting the loading state to true when login starts
        setIsLoading(true);
        // Resetting any previous errors
        setError(null);

        // Sending a POST request to the login endpoint with the username and password
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_API_URL}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            const json = await response.json();

            if (!response.ok) {
                setError(
                    json.message ||
                        "Incorrect username or password, please try again"
                );
                return;
            }

            localStorage.setItem("user", JSON.stringify(json));
            dispatch({ type: "LOGIN", payload: json });
        } catch (error) {
            setError("Unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Returning login function along with isLoading and error states
    return { login, isLoading, error };
};
