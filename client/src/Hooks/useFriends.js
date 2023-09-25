import axios from "axios";
import { useEffect, useState } from "react";

export const useFriends = (myUsername, reload) => {
    const [friends, setFriends] = useState();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_API_URL}/friends/${myUsername}`)
            .then((friends) => {
                setFriends(friends.data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                setIsPending(false);
                setError(err.message);
            });
    }, [reload]);
    return { friends, isPending, error };
};
