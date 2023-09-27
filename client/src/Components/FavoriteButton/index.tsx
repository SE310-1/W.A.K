import React, { useState, useEffect } from "react";
import axios from "axios";

interface FavoriteButtonProps {
  movieId: string;
  username: string;
  token: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movieId,
  username,
  token,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check if the movie is already in the user's favorites list
    const checkFavorite = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_API_URL
          }/${username}/favorites/isFavorite/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Failed to check favorite", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavorite();
  }, [movieId, username, token]);

  const handleAddFavorite = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/${username}/favorites/add/${movieId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(true);
    } catch (error) {
      console.error("Failed to add to favorites", error);
    }
  };

  if (isLoading) return <button disabled>Loading...</button>;

  return (
    <button onClick={handleAddFavorite} disabled={isFavorite}>
      {isFavorite ? "Movie added to favorites !" : "Add to favorites"}
    </button>
  );
};

export default FavoriteButton;
