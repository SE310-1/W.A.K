import axios from "axios";

export const addFriend = (myUsername, friendUsername) => {
    axios.put(
        `${
            import.meta.env.VITE_BASE_API_URL
        }/user/${myUsername}/add-friend/${friendUsername}`
    );
};
