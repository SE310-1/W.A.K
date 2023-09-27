import axios from "axios";

/**
 * Constructs the URL for adding a friend.
 *
 * @param {string} myUsername - The username of the user who wants to add a friend.
 * @param {string} friendUsername - The username of the user to be added as a friend.
 * @returns {string} The constructed URL.
 */
const constructAddFriendUrl = (myUsername, friendUsername) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    return `${baseUrl}/user/${myUsername}/add-friend/${friendUsername}`;
};

/**
 * Sends a request to add a friend for the given user.
 *
 * @function
 * @param {string} myUsername - The username of the user who wants to add a friend.
 * @param {string} friendUsername - The username of the user to be added as a friend.
 * @returns {Promise} A promise that resolves when the server request is complete.
 */
export const addFriend = (myUsername, friendUsername) => {
    // Sending a PUT request to the server to add a friend for the given user.
    return axios
        .put(constructAddFriendUrl(myUsername, friendUsername))
        .catch((error) => {
            console.error("Error adding friend:", error);
            // Appropriate error handling can be added here.
        });
};
