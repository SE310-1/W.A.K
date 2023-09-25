import axios from "axios";
import { useState, useEffect } from "react";

/**
 * Custom React Hook to search and manage a list of users based on the input search value.
 *
 * @function
 * @param {string} textFieldValue - The input search value used to filter the users.
 * @returns {Object} - An object containing the list of searched users, loading state, and any error encountered.
 * @property {Array} searchUsers - An array of users filtered based on the input search value.
 * @property {boolean} isPending - Indicates whether the user data is still being fetched.
 * @property {string} error - Error message, if any error occurs while fetching the user data.
 */
export const useSearchFriends = (textFieldValue) => {
    // State to hold the list of searched users
    const [searchUsers, setSearchUsers] = useState([]);

    // State to manage the loading state
    const [isPending, setIsPending] = useState(true);

    // State to manage any error encountered during the fetching
    const [error, setError] = useState(null);

    // Effect to fetch and filter the user data whenever the textFieldValue changes
    useEffect(() => {
        // Sending a GET request to fetch the user data
        axios
            .get(`${import.meta.env.VITE_BASE_API_URL}/users`)
            .then((users) => {
                // Filtering the user data based on the input search value and updating the state
                setSearchUsers(
                    users.data.filter((user) =>
                        user.username.includes(textFieldValue)
                    )
                );
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                // Updating the state with the error encountered
                setIsPending(false);
                setError(err.message);
            });
    }, [textFieldValue]);

    // Returning the list of searched users, loading state, and any error encountered
    return { searchUsers, isPending, error };
};
