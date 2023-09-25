import axios from "axios";
import { declineFriendRequest } from "./declineFriendRequest.js";

export const acceptFriendRequest = async (myUsername, friendUsername) => {
    try {
        await axios.put(
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${myUsername}/accept-friend-request/${friendUsername}`
        );

        await axios.put(
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${friendUsername}/accept-friend-request/${myUsername}`
        );
        declineFriendRequest(myUsername, friendUsername);

        // After declining the friend request, fetch the updated list
    } catch (error) {
        console.error("Error declining friend request:", error);
        // Handle error appropriately
    }
};
