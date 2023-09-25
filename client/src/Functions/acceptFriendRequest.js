import axios from "axios";
import { declineFriendRequest } from "./declineFriendRequest.js";

/**
 * Accepts a friend request and updates the friend lists of both users.
 *
 * @function
 * @async
 * @param {string} myUsername - The username of the user accepting the friend request.
 * @param {string} friendUsername - The username of the user who sent the friend request.
 * @returns {Promise<void>} A promise that resolves when all server requests are complete.
 * @throws Will throw an error if any of the requests to the server fail.
 */
export const acceptFriendRequest = async (myUsername, friendUsername) => {
    try {
        // Sending a PUT request to the server to accept the friend request for the current user.
        await axios.put(
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${myUsername}/accept-friend-request/${friendUsername}`
        );

        // Updating the friend list of the user who sent the request.
        await axios.put(
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${friendUsername}/accept-friend-request/${myUsername}`
        );

        // Declining the friend request after it has been accepted to update the list.
        declineFriendRequest(myUsername, friendUsername);
    } catch (error) {
        console.error("Error accepting friend request:", error);
        // Appropriate error handling can be added here.
    }
};
