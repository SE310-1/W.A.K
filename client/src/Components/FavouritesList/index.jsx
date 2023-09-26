import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useFavourites } from "../../Hooks/useFavourites.js";
import { useRating } from "../../Hooks/useRating";
import { apiKey } from "../../../env.js";
import axios from "axios";
import MovieCard from "../../Components/MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";

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

    const handleMovieDeleted = (deletedMovieId) => {
        setMoviesData(
            moviesData.filter((movie) => movie.id !== deletedMovieId)
        );
    };

    return (
        <div className="favourites-page">
            <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {moviesData &&
                    moviesData.map((movie, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <MovieCard movie={movie} />
                            <DeleteButton
                                movieId={movie.id}
                                onMovieDeleted={handleMovieDeleted}
                            />
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
};

export default FavouritesList;
