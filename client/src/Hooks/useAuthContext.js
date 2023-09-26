// Importing required dependencies
import { AuthContext } from "../Context/AuthContext.jsx";
import { useContext } from "react";

// Defining a custom hook 'useAuthContext' to consume AuthContext
export const useAuthContext = () => {
    // useContext Hook is used to subscribe to the context value (AuthContext in this case).
    const context = useContext(AuthContext);

    // Check if the useAuthContext hook is used inside a component wrapped by AuthContextProvider.
    // If not, throw an error.
    if (!context) {
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );
    }

    // Return the context value (i.e., the value passed by the Provider of AuthContext).
    return context;
};
