import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

// Define the props interface for the FavoriteButton component
interface FavoriteButtonProps {
    movieId: string;
    movieTitle: string;
    username: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    movieId,
    movieTitle,
    username,
}) => {
    // State variables to track whether the movie is a favorite and loading status
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Function to check if the movie is already in the user's favorites list
        const checkFavorite = async () => {
            try {
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BASE_API_URL
                    }/${username}/favorites/isFavorite/${movieId}`
                );
                setIsFavorite(response.data.isFavorite);
            } catch (error) {
                console.error("Failed to check favorite", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Invoke the checkFavorite function when the component mounts or when movieId, username, or token changes
        checkFavorite();
    }, [movieId, username]); // removed token

    // Function to handle adding the movie to favorites
    const handleAddFavorite = async () => {
        try {
            await axios.post(
                `${
                    import.meta.env.VITE_BASE_API_URL
                }/${username}/favorites/add/`,
                { movieId, movieTitle }
            );
            setIsFavorite(true);
        } catch (error) {
            console.error("Failed to add to favorites", error);
        }
    };

    // If loading, display a disabled button with "Loading..."
    if (isLoading) return <button disabled>Loading...</button>;

    // Render the button to add or display a message if the movie is already a favorite
    return (
        <button onClick={handleAddFavorite} disabled={isFavorite}>
            {isFavorite ? "Movie added to favorites !" : "Add to favorites"}
        </button>
    );
};

export default FavoriteButton;
