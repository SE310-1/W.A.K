import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { BASE_URL } from "../../env";


export const useFavourites = (username) => {
  const [favourites, setFavourites] = useState([]); // create a state for the favourites list
  const [loading, setLoading] = useState(false); // create a state for the loading status
  const [error, setError] = useState(null); // create a state for the error message
  const { user } = useAuthContext(); // get the user from the AuthContext

  useEffect(() => {
    // fetch the favourites list from the backend server using the username as a parameter
    const fetchFavourites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/favorites`,
          {
            headers: { 'Authorization': `Bearer ${user.token}` } // add authorization header
          }
        );
        const json = await response.json();
        if (response.ok) {
          setFavourites(json); // update the favourites state with the array of movie ids
        } else {
          setError(json.error); // update the error state with the error message
        }
      } catch (err) {
        setError(err.message); // update the error state with the error message
      }
      setLoading(false);
    };
    if (user) {
      fetchFavourites();
    }
  }, [user]); // run this effect whenever the user changes

  // create a function for adding a movie to the favourites list
  const addFavourite = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/favorites/add/${movieId}`, // change url parameter
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.token}` } // add authorization header
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFavourites(prev => [...prev, movieId]); // update the favourites state with the movie id
      } else {
        setError(json.error); // update the error state with the error message
      }
    } catch (err) {
      setError(err.message); // update the error state with the error message
    }
    setLoading(false);
  };

  // create a function for removing a movie from the favourites list
  const removeFavourite = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/favorites/remove/${movieId}`, // change url parameter
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` } // add authorization header
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFavourites(prev => prev.filter(id => id !== movieId)); // update the favourites state by filtering out the movie id
      } else {
        setError(json.error); // update the error state with the error message
      }
    } catch (err) {
      setError(err.message); // update the error state with the error message
    }
    setLoading(false);
  };

  // create a function for checking if a movie is in the favourites list
  const isFavourite = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/favorites/isFavorite/${movieId}`,
        {
          headers: { 'Authorization': `Bearer ${user.token}` } // add authorization header
        }
      );
      const json = await response.json();
      if (response.ok) {
        return json.message === "Movie in favorites"; // return true or false based on the message
      } else {
        throw new Error(json.error); // throw an error with the error message
      }
    } catch (err) {
      console.error(err); // log the error
      return false; // return false by default
    }
  };

  return { favourites, loading, error, addFavourite, removeFavourite, isFavourite }; // return the favourites list, the loading and error states, and the add, remove, and isFavourite functions
};
