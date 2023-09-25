import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Custom React Hook to fetch and manage the friends list of a user.
 *
 * @function
 * @param {string} myUsername - The username of the user whose friends list is to be fetched.
 * @param {boolean} reload - A dependency to refetch the friends list when its value changes.
 * @returns {Object} - An object containing the friends list, loading state, and any error encountered.
 * @property {Array} friends - An array of friends of the user.
 * @property {boolean} isPending - Indicates whether the friends list is still being fetched.
 * @property {string} error - Error message, if any error occurs while fetching the friends list.
 */
export const useFriends = (myUsername, reload) => {
    // State to hold the friends list
    const [friends, setFriends] = useState();

    // State to manage the loading state
    const [isPending, setIsPending] = useState(true);

    // State to manage any error encountered during the fetching
    const [error, setError] = useState(null);

    // Effect to fetch the friends list whenever the component mounts or reload changes
    useEffect(() => {
        // Sending a GET request to fetch the friends list of the user
        axios
            .get(`${import.meta.env.VITE_BASE_API_URL}/friends/${myUsername}`)
            .then((friends) => {
                // Updating the state with the fetched friends list
                setFriends(friends.data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                // Updating the state with the error encountered
                setIsPending(false);
                setError(err.message);
            });
    }, [reload]);

    // Returning the friends list, loading state, and any error encountered
    return { friends, isPending, error };
};
