import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { BASE_URL, apiKey } from "../../env";


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
          `${BASE_URL}/api/${username}/favourites`
        );
        const json = await response.json();
        if (response.ok) {
          setFavourites(json.favourites); // update the favourites state with the array of movie ids
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
  }, [user, username]); // run this effect whenever the user or the username changes

  // create a function for adding a movie to the favourites list
  const addFavourite = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/api/${username}/favourites`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFavourites(json.favourites); // update the favourites state with the array of movie ids
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
        `${BASE_URL}/api/${username}/favourites/${movieId}`,
        {
          method: 'DELETE',
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFavourites(json.favourites); // update the favourites state with the array of movie ids
      } else {
        setError(json.error); // update the error state with the error message
      }
    } catch (err) {
      setError(err.message); // update the error state with the error message
    }
    setLoading(false);
  };

  return { favourites, loading, error, addFavourite, removeFavourite }; // return the favourites list, the loading and error states, and the add and remove functions
};