import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useFavourites } from "../../Hooks/useFavourites.js";
import { useRating } from "../../Hooks/useRating";
import { BASE_URL, apiKey } from "../../../env.js";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";

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

  async function getReccomendations (favourites: string[]) {
      if (favourites.length) {
        
        // Check how many favourites the user has

        const selectedFavs = favourites.slice(0, Math.min(12, favourites.length));

        const requests = selectedFavs.map(movieId => fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US`
          ).then(x => x.json()));
        

        const resolved = await Promise.all(requests);
        const films = resolved.map(resp => {
          console.log("About to reference results");
          console.log(resp);
          return resp.results.slice(0, 20);
        })

        var finalList: any[] = [];
        var current = 0;

        // create merged list of all films

        for (let i  = 0; i < 20; i++) {
          
          films.map((movieList: any[]) => {

            finalList[current] = movieList[i];
            current++;
          });

        }


        const filterUndefiend = finalList.filter(x => !!x);
        const filterFavourites = filterUndefiend.filter(x => {
          
  
          return !favourites.includes(`${x.id}`)});

    
        const ids = filterFavourites.map(x => x.id);

        const filterDuplicates = filterFavourites.filter((x, index) => ids.indexOf(x.id) === index);

        const selected = filterDuplicates.slice(0, 12);
        
        console.log(selected);

        return selected;
        
        // For each favourite (up to a max of 12), generate their favourites
        // Iterate through these lists and add 1 from each to the reccomendations array
        // Before adding them, make sure they are not the user's favourite already
        // Repeat this until 12 reccomendations have been generated

        // return the list of 12 favourites
      } 
      // If they have none, return the 12 most popular
      const popular = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US`
      ).then((response) => response.json())
      
      const reccomendedFilms = popular.results.slice(0, 12);
      return reccomendedFilms;
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

        // Fetch details for each favorite movie using promises
        const movieDetailsPromises = response.data.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const reccomendations = await getReccomendations(response.data);
      
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
    triggerReload(!reload);
  };

  console.log("Initial Values");
  console.log(moviesData);
  console.log(reccomendations);

  return (
    <div className="favourites-page">
      <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
        {error && <div>{error}</div>}
        {isPending && <div>Loading...</div>}
        {!isPending && moviesData.length === 0 && (
          <div>Nothing added to favorites yet!</div>
        )}
        {!isPending && moviesData &&
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
      <br></br>
      <br></br>
      <h1  className="favourites-section-title">Reccomended For You</h1>
      <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
        {error && <div>{error}</div>}
        {isPending && <div>Loading...</div>}
        {!isPending && reccomendations && moviesData &&
          reccomendations.map((movie1, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <MovieCard movie={movie1} />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default FavouritesList;
