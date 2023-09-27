import { apiKey } from "../../env.js";

export const computeThemeColourAndImage = async (user, setThemeColour, setThemeImage) => {
  const favFetchOptions = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const favRes = await fetch(
    `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`,
    favFetchOptions
  );
  const favJson = await favRes.json();

  const movieDetailsPromises = favJson.map(async (movieId) => {
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
    );
    return await detailsRes.json();
  });

  const movieDetails = await Promise.all(movieDetailsPromises);

  setThemeColour("red");
}
