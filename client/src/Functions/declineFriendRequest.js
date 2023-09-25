import axios from "axios";

export const declineFriendRequest = async (myUsername, friendUsername) => {
    try {
        await axios.put(
            `${
                import.meta.env.VITE_BASE_API_URL
            }/user/${myUsername}/decline-friend-request/${friendUsername}`
        );
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
};
