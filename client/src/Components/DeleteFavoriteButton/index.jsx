import React from "react";
import axios from "axios";
import { useAuthContext } from "../../Hooks/useAuthContext";

const DeleteButton = ({ movieId }) => {
    const { user } = useAuthContext();

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BASE_API_URL}/${
                    user.username
                }/favorites/remove/${movieId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            // After deleting, you might want to refetch the favorites or update the local state
            // to reflect the change in the UI.
            console.log("Movie removed from favorites");
        } catch (error) {
            console.error("Failed to remove movie from favorites", error);
        }
    };

    return <button onClick={handleDelete}>Delete from Favorites</button>;
};

export default DeleteButton;
