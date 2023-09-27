// Importing the useAuthContext custom hook
import { useAuthContext } from "./useAuthContext";

// Defining a custom hook 'useLogout'
export const useLogout = () => {
    // Destructuring dispatch from the context to dispatch actions
    const { dispatch } = useAuthContext();

    // Defining the logout function
    const logout = () => {
        // Removing the user item from localStorage
        localStorage.removeItem("user");
        // Dispatching the 'LOGOUT' action to update the context/state
        dispatch({ type: "LOGOUT" });
    };

    // Returning the logout function from the custom hook
    return { logout };
};
