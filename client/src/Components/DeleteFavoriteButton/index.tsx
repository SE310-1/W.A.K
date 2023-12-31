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
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`
      );
      const favourites = response.data.map((x) => x.movieId);

      if (favourites.length == 0) {
        //movieID = random movie from top movies list
        movieId = 24791;
        const movieTitle = "new";
        await axios.put(
          `${import.meta.env.VITE_BASE_API_URL}/${
            user.username
          }/profilePicture/replace/`,
          { movieId, movieTitle } // Pass the movieId in the request body
        );
      } else {
        const responseId = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${user.username}/profilePicture`
        );
        const isFavouriteId = responseId.data.profilePicture[0].movieId;
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${
            user.username
          }/favorites/isFavorite/${isFavouriteId}`
        );
        const isFavorite = response.data.isFavorite;
        if (!isFavorite) {
          //movieID = first from favourites list
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`
          );

          const favIds = response.data.map((x) => x.movieId);

          movieId = favIds[0];
          const movieTitle = "new";
          await axios.put(
            `${import.meta.env.VITE_BASE_API_URL}/${
              user.username
            }/profilePicture/replace`,
            { movieId, movieTitle }
          );
        }
      }

      // Call the onMovieDeleted callback to update the UI
      onMovieDeleted(movieId);
    } catch (error) {
      // Handle errors, if any, during the deletion process
      console.error("Failed to remove movie from favorites", error);
    }
  };

  // Render a button that triggers the handleDelete function when clicked
  return (
    <button className="delete-button" onClick={handleDelete}>
      <i className="fas fa-times red-icon bold-icon"></i>&nbsp; Remove
    </button>
  );
};

export default DeleteButton;
