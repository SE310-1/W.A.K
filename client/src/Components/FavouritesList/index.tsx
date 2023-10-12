import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { apiKey } from "../../../env.js";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";
import Spinner from "../../Components/Spinner";
// Define the Movie interface with relevant properties
interface Movie {
  id: number;
  // Add more properties as needed
}

const FavouritesList: React.FC = () => {
  // Access user data from the authentication context
  const { user } = useAuthContext();

  // State variables to manage loading, errors, and movie data
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [reccomendations, setReccomendations] = useState<Movie[]>([]);
  const [reload, triggerReload] = useState(false);

  async function getPopularFilms() {
    const popular = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US`
    ).then((response) => response.json());

    return popular.results;
  }

  async function getReccomendations(favourites: string[]) {
    if (favourites.length) {
      // Select Up to 12 Favs
      const selectedFavs = favourites.slice(0, Math.min(12, favourites.length));

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
          `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const favIds = response.data.map((x) => x.movieId);

        // Fetch details for each favorite movie using promises
        const movieDetailsPromises = favIds.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const reccomendations = await getReccomendations(favIds);
        // Wait for all movie details promises to resolve

        const movieDetails = await Promise.all(movieDetailsPromises);

        setMoviesData(movieDetails);
        setReccomendations(reccomendations);
        setIsPending(false);
      } catch (err: any) {
        setIsPending(false);
        setError(err.message);
      }
    };

    fetchFavourites(); // Invoke the fetchFavourites function when the component mounts
  }, [reload]);

  // Function to handle movie deletion from favorites
  const handleMovieDeleted = (deletedMovieId: number) => {
    setIsPending(true);
    setMoviesData(moviesData.filter((movie) => movie.id !== deletedMovieId));
    triggerReload(!reload); // This will run the process that refreshes reccomendations and favourite data, which will trigger pending to be false
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
                    Nothing added to favorites yet! Check out the
                    Reccomendations Below!
                  </p>
                </div>
              ) : (
                <Grid
                  container
                  spacing={1}
                  sx={{ marginRight: "-8px!important" }}
                >
                  {moviesData.map((movie, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <MovieCard movie={movie} />
                      <DeleteButton
                        movieId={movie.id}
                        onMovieDeleted={handleMovieDeleted}
                      />
                    </Grid>
                  ))}
                </Grid>
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
            <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
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
