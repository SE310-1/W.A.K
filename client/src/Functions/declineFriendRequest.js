import axios from "axios";

/**
 * Constructs the URL for declining a friend request.
 *
 * @param {string} myUsername - The username of the user who wants to decline the friend request.
 * @param {string} friendUsername - The username of the user who sent the friend request.
 * @returns {string} The constructed URL.
 */
const constructDeclineFriendRequestUrl = (myUsername, friendUsername) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    return `${baseUrl}/user/${myUsername}/decline-friend-request/${friendUsername}`;
};

/**
 * Sends a request to decline a friend request.
 *
 * @function
 * @async
 * @param {string} myUsername - The username of the user who wants to decline the friend request.
 * @param {string} friendUsername - The username of the user who sent the friend request.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 * @throws Will throw an error if the request to the server fails.
 */
export const declineFriendRequest = async (myUsername, friendUsername) => {
    try {
        // Sending a PUT request to the server to decline the friend request.
        await axios.put(
            constructDeclineFriendRequestUrl(myUsername, friendUsername)
        );
    } catch (error) {
        console.error("Error declining friend request:", error);
        // Additional error handling can be added here if needed.
    }
};
