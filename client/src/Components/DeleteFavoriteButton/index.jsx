import React from "react";
import axios from "axios";
import { useAuthContext } from "../../Hooks/useAuthContext";

// This allows the deletion of a movie to be reflected in the UI
const DeleteButton = ({ movieId, onMovieDeleted }) => {
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
            onMovieDeleted(movieId);
        } catch (error) {
            console.error("Failed to remove movie from favorites", error);
        }
    };

    return <button onClick={handleDelete}>Delete from Favorites</button>;
};

export default DeleteButton;
