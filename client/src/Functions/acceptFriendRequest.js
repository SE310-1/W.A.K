import axios from "axios";
import { declineFriendRequest } from "./declineFriendRequest.js";

/**
 * Constructs the URL for the friend request action.
 *
 * @param {string} myUsername - The username of the user accepting the friend request.
 * @param {string} friendUsername - The username of the user who sent the friend request.
 * @returns {string} The constructed URL.
 */
const constructFriendRequestUrl = (myUsername, friendUsername) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    return `${baseUrl}/user/${myUsername}/accept-friend-request/${friendUsername}`;
};

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
        await axios.put(constructFriendRequestUrl(myUsername, friendUsername));

        // Updating the friend list of the user who sent the request.
        await axios.put(constructFriendRequestUrl(friendUsername, myUsername));

        // Declining the friend request after it has been accepted to update the list.
        declineFriendRequest(myUsername, friendUsername);
    } catch (error) {
        console.error("Error accepting friend request:", error);
        // Appropriate error handling can be added here.
    }
};
