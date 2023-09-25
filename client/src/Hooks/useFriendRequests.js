import axios from "axios";
import { useEffect, useState } from "react";

export const useFriendRequests = (myUsername, reload) => {
    const [friendRequests, setFriendRequests] = useState();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(
                `${
                    import.meta.env.VITE_BASE_API_URL
                }/friend-requests/${myUsername}`
            )
            .then((friendRequests) => {
                setFriendRequests(friendRequests.data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                setIsPending(false);
                setError(err.message);
            });
    }, [reload]);
    return { friendRequests, isPending, error };
};
