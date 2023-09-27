import { useCallback } from "react";
import { useAuthContext } from "./useAuthContext";

// Defining a custom hook 'useLogout'
export const useLogout = () => {
    // Destructuring dispatch from the context to dispatch actions
    const { dispatch } = useAuthContext();

    // Defining the logout function
    const logout = useCallback(() => {
        // Removing the user item from localStorage
        localStorage.removeItem("user");
        // Dispatching the 'LOGOUT' action to update the context/state
        dispatch({ type: "LOGOUT" });
    }, [dispatch]);

    // Returning the logout function from the custom hook
    return { logout };
};
