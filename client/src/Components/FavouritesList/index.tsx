import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useFavourites } from "../../Hooks/useFavourites.js";
import { useRating } from "../../Hooks/useRating";
import { apiKey } from "../../../env.js";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";

interface Movie {
  id: number;
  // Add more properties as needed
}

const FavouritesList: React.FC = () => {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const movieDetailsPromises = response.data.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const movieDetails = await Promise.all(movieDetailsPromises);
        setMoviesData(movieDetails);
        setIsPending(false);
      } catch (err: any) {
        setIsPending(false);
        setError(err.message);
      }
    };

    fetchFavourites();
  }, []);

  const handleMovieDeleted = (deletedMovieId: number) => {
    setMoviesData(moviesData.filter((movie) => movie.id !== deletedMovieId));
  };

  return (
    <div className="favourites-page">
      <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
        {error && <div>{error}</div>}
        {isPending && <div>Loading...</div>}
        {!isPending && moviesData.length === 0 && (
          <div>Nothing added to favorites yet!</div>
        )}
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
