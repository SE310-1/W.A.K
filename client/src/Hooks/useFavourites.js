import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../../env";

// Custom hook for managing user favorites
export const useFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [profilePicture, setProfilePicture] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  // Function to fetch data from the server with error handling
  const fetchData = async (url, options = {}, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` },
        ...options,
      });
      const json = await response.json();
      if (response.ok) {
        onSuccess(json);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user favorites when the 'user' context changes
  useEffect(() => {
    if (user) {
      fetchData(`${BASE_URL}/favorites`, {}, (json) => setFavourites(json));
    }
  }, [user]);

  // Function to add a movie to favorites (TODO: update pfp)
  const addFavourite = async (movieId) => {
    await fetchData(
      `${BASE_URL}/favorites/add/${movieId}`,
      { method: "POST" },
      () => setFavourites((prev) => [...prev, movieId])
    );
    if (favourites.length == 1) {
      await fetchData(
        `${BASE_URL}/profilePicture/replace/${movieId}`,
        { method: "POST" },
        () => setProfilePicture(movieId)
      );
    }
  };

  // Function to remove a movie from favorites (TODO: update pfp)
  const removeFavourite = async (movieId) => {
    await fetchData(
      `${BASE_URL}/favorites/remove/${movieId}`,
      { method: "DELETE" },
      () => setFavourites((prev) => prev.filter((id) => id !== movieId))
    );
    if (favourites.length == 0) {
      //movieID = random movie from top movies list
      await fetchData(
        `${BASE_URL}/profilePicture/replace/${movieId}`,
        { method: "POST" },
        () => setProfilePicture(movieId)
      );
    } else {
      const response = await fetchData(`${BASE_URL}/profilePicture`, {
        method: "GET",
      });
      if (!isFavourite(response)) {
        //movieID = first from favourites list
        const response = await fetchData(`${BASE_URL}/favorites${movieId}`, {
          method: "GET",
        });

        const favIds = response.data.map((x) => x.movieId);

        await fetchData(
          `${BASE_URL}/profilePicture/replace/${favIds[0]}`,
          { method: "POST" },
          () => setProfilePicture(movieId)
        );
      }
    }
  };

  // Function to check if a movie is in favorites
  const isFavourite = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/favorites/isFavorite/${movieId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      return json.message === "Movie in favorites";
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Expose favorites, loading state, error state, and functions
  return {
    favourites,
    loading,
    error,
    addFavourite,
    removeFavourite,
    isFavourite,
  };
};
