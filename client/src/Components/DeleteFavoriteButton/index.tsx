import React from "react";
import axios from "axios";
import { useAuthContext } from "../../Hooks/useAuthContext";
import "./style.css";

// Define the props for the DeleteButton component
interface DeleteButtonProps {
    movieId: number; // The ID of the movie to be deleted from favorites
    onMovieDeleted: (movieId: number) => void; // Callback function to handle movie deletion
}

// DeleteButton component for removing a movie from favorites
const DeleteButton: React.FC<DeleteButtonProps> = ({
    movieId,
    onMovieDeleted,
}) => {
    // Access user information from the authentication context
    const { user } = useAuthContext();

    // Function to handle the deletion of a movie from favorites
    const handleDelete = async () => {
        try {
            // Send a DELETE request to the API to remove the movie from the user's favorites
            await axios.delete(
                `${import.meta.env.VITE_BASE_API_URL}/${
                    user.username
                }/favorites/remove/${movieId}`,
                {
                    // headers: {
                    //   Authorization: `Bearer ${user.token}`, // Include the user's token for authorization
                    // },
                }
            );

            // Call the onMovieDeleted callback to update the UI
            onMovieDeleted(movieId);
        } catch (error) {
            // Handle errors, if any, during the deletion process
            console.error("Failed to remove movie from favorites", error);
        }
    };

    // Render a button that triggers the handleDelete function when clicked
    return <button onClick={handleDelete}>Delete from Favorites</button>;
};

export default DeleteButton;
