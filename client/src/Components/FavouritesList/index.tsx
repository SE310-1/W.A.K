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

interface FavouritesListProps {
    onFirstMovieChange: (movie: any) => void;
}

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

    useEffect(() => {
        // Function to fetch user's favorite movies
        const fetchFavourites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${
                        user.username
                    }/favorites?sortBy=${sortOrder}`
                );

                const favIds = response.data.map((x) => x.movieId);

                const movieDetailsPromises = response.data.map(
                    async (favorite: FavouriteMovie) => {
                        const movieDetailRes = await fetch(
                            `https://api.themoviedb.org/3/movie/${favorite.movieId}?api_key=${apiKey}&language=en-US`
                        );
                        const movieDetail = await movieDetailRes.json();

                        // Return a combined object with movie details and rating
                        return {
                            movieId: movieDetail.id,
                            ...movieDetail,
                            rating: favorite.rating,
                        };
                    }
                );

                const reccomendations = await getReccomendations(favIds);

                // Wait for all movie details promises to resolve
                const movieDetailsWithRating = await Promise.all(
                    movieDetailsPromises
                );

                if (movieDetailsWithRating.length > 0) {
                    onFirstMovieChange(movieDetailsWithRating[0]);
                }

                setMoviesData(movieDetailsWithRating);
                setReccomendations(reccomendations);
                setIsPending(false);
            } catch (err: any) {
                setIsPending(false);
                setError(err.message);
            }
        };

        fetchFavourites(); // Invoke the fetchFavourites function when the component mounts
    }, [reload, sortOrder]);

    // Function to handle movie deletion from favorites
    const handleMovieDeleted = (deletedMovieId: number) => {
        const wasFirstMovie =
            moviesData[0] && moviesData[0].id === deletedMovieId;

        const updatedMoviesData = moviesData.filter(
            (movie) => movie.id !== deletedMovieId
        );
        setMoviesData(updatedMoviesData);

        if (wasFirstMovie) {
            if (updatedMoviesData.length > 0) {
                onFirstMovieChange(updatedMoviesData[0]);
            } else {
                // Reset to default theme if no movies are left.
                onFirstMovieChange(null);
            }
        }
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
