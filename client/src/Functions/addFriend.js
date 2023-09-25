import axios from "axios";

/**
 * Sends a request to add a friend for the given user.
 *
 * @function
 * @param {string} myUsername - The username of the user who wants to add a friend.
 * @param {string} friendUsername - The username of the user to be added as a friend.
 */
export const addFriend = (myUsername, friendUsername) => {
    // Sending a PUT request to the server to add a friend for the given user.
    axios.put(
        `${
            import.meta.env.VITE_BASE_API_URL
        }/user/${myUsername}/add-friend/${friendUsername}`
    );
};
