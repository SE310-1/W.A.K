import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useFavourites } from "../../Hooks/useFavourites.js";
import { useRating } from "../../Hooks/useRating";
import MovieCard from "../../Components/MovieCard";
import { apiKey } from "../../../env.js";
import axios from "axios";

const FavouritesList = () => {
    const { user } = useAuthContext();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [moviesData, setMoviesData] = useState([]);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${
                        user.username
                    }/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                const movieDetailsPromises = response.data.map((movieId) =>
                    fetch(
                        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
                    ).then((response) => response.json())
                );

                const movieDetails = await Promise.all(movieDetailsPromises);
                setMoviesData(movieDetails);
                setIsPending(false);
            } catch (err) {
                setIsPending(false);
                setError(err.message);
            }
        };

        fetchFavourites();
    }, []);

    return (
        <div className="favourites-page">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {moviesData.map((movie) => (
                <div key={movie.id}>{movie.title}</div>
            ))}
            <h1>Favourites Page</h1>
        </div>
    );
};

export default FavouritesList;
