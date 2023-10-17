import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { apiKey } from "../../../env.js";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";
import Spinner from "../../Components/Spinner";
import "./style.css";

// Define the Movie interface with relevant properties
interface FavouriteMovie {
    movieId: string;
    movieTitle: string;
    addedAt: Date;
    rating: number;
}

// TypeScript interface describing the properties that FavouritesList component expects.
interface FavouritesListProps {
    onFirstMovieChange: (movie: any) => void;
}

// FavouritesList component declaration.
const FavouritesList: React.FC<FavouritesListProps> = ({
    onFirstMovieChange,
}) => {
    // Access user data from the authentication context
    const { user } = useAuthContext();

    // State variables to manage loading, errors, and movie data
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [moviesData, setMoviesData] = useState<FavouriteMovie[]>([]);
    const [reccomendations, setReccomendations] = useState<FavouriteMovie[]>(
        []
    );
    const [reload, triggerReload] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>("added"); // New state variable to manage the sortin order

    async function getPopularFilms() {
        const popular = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US`
        ).then((response) => response.json());

        return popular.results;
    }

    async function getReccomendations(favourites: string[]) {
        if (favourites.length) {
            // Select Up to 12 Favs
            const selectedFavs = favourites.slice(
                0,
                Math.min(12, favourites.length)
            );

            // Fetch Reccomendations for Each of them
            const requests = selectedFavs.map((movie) =>
                fetch(
                    `https://api.themoviedb.org/3/movie/${movie}/recommendations?api_key=${apiKey}&language=en-US`
                ).then((resp) => resp.json())
            );

            const resolved = await Promise.all(requests);
            // Get the output of the requests
            const films = resolved.map((resp) => resp.results.slice(0, 20));

            var finalList: any[] = [];
            var current = 0;

            // Create merged list of all films
            for (let i = 0; i < 20; i++) {
                films.map((movieList: any[]) => {
                    finalList[current] = movieList[i];
                    current++;
                });
            }

            const definedFilms = finalList.filter((x) => !!x);

            // Handling the rare case where the API returns no reccomendations
            const populatedRecs: any[] = definedFilms.length
                ? definedFilms
                : await getPopularFilms();

            // Filter undefined values and those already in the users favourites
            const filterFavourites = populatedRecs.filter(
                (x) => !favourites.includes(`${x.id}`)
            );

            // Filter duplicate films
            const ids = filterFavourites.map((x) => x.id);
            const filterDuplicates = filterFavourites.filter(
                (x, index) => ids.indexOf(x.id) === index
            );

            return filterDuplicates.slice(0, 12); // Only return 12 reccomendations
        }
        // If they have none, return the 12 most popular
        return (await getPopularFilms()).slice(0, 12); // Only return 12 reccomendations
    }

    // This effect runs when the 'reload' or 'sortOrder' values change.
    useEffect(() => {
        // Define an asynchronous function to fetch the user's favorite movies.
        const fetchFavourites = async () => {
            try {
                // Fetch the list of favorite movies for the user from the backend API.
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${
                        user.username
                    }/favorites?sortBy=${sortOrder}`
                );

                // Extract movieIds from the response.
                const favIds = response.data.map((x) => x.movieId);

                // For each favorite movie, fetch its detailed information from the TMDB API.
                const movieDetailsPromises = response.data.map(
                    async (favorite) => {
                        const movieDetailRes = await fetch(
                            `https://api.themoviedb.org/3/movie/${favorite.movieId}?api_key=${apiKey}&language=en-US`
                        );
                        const movieDetail = await movieDetailRes.json();

                        // Combine the movie details with the user's rating and return.
                        return {
                            movieId: movieDetail.id,
                            ...movieDetail,
                            rating: favorite.rating,
                        };
                    }
                );

                // Fetch movie recommendations based on the user's favorite movieIds.
                const reccomendations = await getReccomendations(favIds);

                // Resolve all the promises to get movie details.
                const movieDetailsWithRating = await Promise.all(
                    movieDetailsPromises
                );

                // If there's at least one movie, pass its details to the parent component.
                if (movieDetailsWithRating.length > 0) {
                    onFirstMovieChange(movieDetailsWithRating[0]);
                }

                // Update the component's state with the fetched movie details and recommendations.
                setMoviesData(movieDetailsWithRating);
                setReccomendations(reccomendations);
                setIsPending(false); // Indicate that the data fetching is complete.
            } catch (err) {
                // Handle any errors during the data fetching.
                setIsPending(false); // Indicate that the data fetching is complete, even if it resulted in an error.
                setError(err.message); // Update the error state with the error message.
            }
        };

        // Call the defined fetchFavourites function.
        fetchFavourites();
    }, [reload, sortOrder]);

    // Define a function to handle the deletion of a movie from the user's favorites.
    const handleMovieDeleted = (deletedMovieId) => {
        // Determine if the deleted movie was the first in the list.
        const wasFirstMovie =
            moviesData[0] && moviesData[0].id === deletedMovieId;

        // Filter out the deleted movie from the moviesData list.
        const updatedMoviesData = moviesData.filter(
            (movie) => movie.id !== deletedMovieId
        );
        setMoviesData(updatedMoviesData); // Update the state with the new list of movies.

        // If the deleted movie was the first in the list, update the theme of the parent component.
        if (wasFirstMovie) {
            if (updatedMoviesData.length > 0) {
                onFirstMovieChange(updatedMoviesData[0]); // Pass details of the new first movie.
            } else {
                // If no movies are left after the deletion, reset the theme.
                onFirstMovieChange(null);
            }
        }
        // Toggle the 'reload' state to force the useEffect above to run again.
        triggerReload(!reload);
    };

    return (
        <div className="favourites-page">
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    {isPending || !moviesData ? (
                        <Spinner />
                    ) : (
                        <>
                            {!moviesData.length ? (
                                <div>
                                    <p className="text-shadow">
                                        Nothing added to favorites yet! Check
                                        out the Reccomendations Below!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="dropdown-container">
                                        <label
                                            htmlFor="sortOrder"
                                            className="dropdown-label"
                                        >
                                            Sort by:{" "}
                                        </label>
                                        <select
                                            className="dropdown-select"
                                            id="sortOrder"
                                            value={sortOrder}
                                            onChange={(e) =>
                                                setSortOrder(e.target.value)
                                            }
                                        >
                                            <option value="added">
                                                Added Date
                                            </option>
                                            <option value="rating">
                                                Top rated by you
                                            </option>
                                        </select>
                                    </div>
                                    <Grid
                                        container
                                        spacing={1}
                                        sx={{ marginRight: "-8px!important" }}
                                    >
                                        {moviesData.map((movie, index) => (
                                            <Grid
                                                item
                                                xs={6}
                                                sm={4}
                                                md={3}
                                                key={index}
                                            >
                                                <div className="movie-item-container">
                                                    <MovieCard movie={movie} />
                                                </div>

                                                <div className="movie-subheader-container">
                                                    <div className="rating-div">
                                                        {" "}
                                                        {movie.rating > 0
                                                            ? `You rated : ${movie.rating}/5`
                                                            : "Not rated yet"}
                                                    </div>

                                                    <div className="delete-btn-div">
                                                        <DeleteButton
                                                            movieId={
                                                                movie.movieId
                                                            } // This is the TMDB movie object
                                                            onMovieDeleted={
                                                                handleMovieDeleted
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            <br></br>
            <br></br>
            <h1 className="favourites-section-title">Reccomended For You</h1>
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    {isPending || !reccomendations || !moviesData ? (
                        <Spinner />
                    ) : (
                        <Grid
                            container
                            spacing={1}
                            sx={{ marginRight: "-8px!important" }}
                        >
                            {reccomendations.map((movie1, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <MovieCard movie={movie1} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}
        </div>
    );
};

export default FavouritesList;
