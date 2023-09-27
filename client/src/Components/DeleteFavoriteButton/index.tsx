import React from "react";
import axios from "axios";
import { useAuthContext } from "../../Hooks/useAuthContext";

interface DeleteButtonProps {
  movieId: number; // Correct the type to match your movie ID type
  onMovieDeleted: (movieId: number) => void;
}
// This allows the deletion of a movie to be reflected in the UI
const DeleteButton: React.FC<DeleteButtonProps> = ({
  movieId,
  onMovieDeleted,
}) => {
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
