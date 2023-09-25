import axios from "axios";
import { useState, useEffect } from "react";

export const useSearchFriends = (textFieldValue) => {
    const [searchUsers, setSearchUsers] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_API_URL}/users`)
            .then((users) => {
                setIsPending(false);
                setError(null);
                setSearchUsers(
                    users.data.filter((user) =>
                        user.username.includes(textFieldValue)
                    )
                );
            })
            .catch((err) => {
                setIsPending(false);
                setError(err.message);
            });
    }, [textFieldValue]);
    return { searchUsers, isPending, error };
};
