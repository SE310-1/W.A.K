import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch friend requests for a given user.
 *
 * @function
 * @param {string} myUsername - The username of the user for whom to fetch friend requests.
 * @param {boolean} reload - Dependency to re-run the effect and fetch the data again.
 * @returns {Object} - An object containing the friend requests, loading state, and any error that occurred.
 */
export const useFriendRequests = (myUsername, reload) => {
    // State for storing friend requests, loading state, and errors.
    const [incoming, setFriendRequests] = useState();
    const [outgoing, setOutgoing] = useState();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetching friend requests for the given username.
        axios
            .get(
                `${
                    import.meta.env.VITE_BASE_API_URL
                }/friend-requests/${myUsername}`
            )
            .then((friendRequests) => {
                // On success, updating the state with the received data.
                setFriendRequests(friendRequests.data.incoming);
                setOutgoing(friendRequests.data.outgoing);
                setIsPending(false);
            })
            .catch((err) => {
                // On error, updating the error state with the received error message.
                setIsPending(false);
                setError(err.message);
            });
    }, [reload]); // Re-run the effect when the 'reload' dependency changes.

    // Returning the result.
    return { incoming, outgoing, isPending, error };
};
