import { useCallback } from "react";
import { useAuthContext } from "./useAuthContext";

// Defining a custom hook 'useLogout'
export const useLogout = () => {
    // Destructuring user from the context to user actions
    const { user } = useAuthContext();

    // Defining the logout function
    const logout = useCallback(() => {
        // Removing the user item from localStorage
        localStorage.removeItem("user");
        // usering the 'LOGOUT' action to update the context/state
        user({ type: "LOGOUT" });
    }, [user]);

    // Returning the logout function from the custom hook
    return { logout };
};
