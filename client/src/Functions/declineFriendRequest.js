import axios from "axios";

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
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${myUsername}/decline-friend-request/${friendUsername}`
        );
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
};
