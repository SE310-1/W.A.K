import { apiKey } from "../../env.js";
import ColorThief from "colorthief";

/**
 * This function uses the user's first favorite movie to update the app theming.
 * 
 * @param {User} user The current user context
 * @param {Function} setThemeColour Function to update theme colour state
 * @param {Function} setThemeImage Function to update 
 */

export const computeThemeColourAndImage = async (user, setThemeColour, setThemeImage) => {
  // The user must be authenticated to access their favourites list
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

  // Use TMDB to grab the poster image
  const movieDetailsPromises = favJson.map(async (movie) => {

    const id = movie.movieId || movie; // Movie Id could be in the form of a movie object (new) or movie id string (old)

    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    ).then(resp => resp.json());
  });

  const movieDetails = await Promise.all(movieDetailsPromises);

  // Check that there actually is at least one favorite
  if (movieDetails != null && movieDetails.length > 0) {
    const themeImageUrl = `https://image.tmdb.org/t/p/w500/${movieDetails[0].backdrop_path}`;
    setThemeImage(themeImageUrl);

    const colorThief = new ColorThief();

    // Mock creating an image
    // Color thief requires an img element to determine to dominant colour
    const image = document.createElement("img");
    image.setAttribute("crossOrigin", "Anonymous");
    image.setAttribute("src", themeImageUrl);
    image.style.display = "none";
    document.body.appendChild(image);
    image.addEventListener("load", async () => {
      // Colour is provided as a RGB array
      const colour = await colorThief.getColor(image);

      const hexBody = colour.map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      }).join("");
      const hex = `#${hexBody}`;
      setThemeColour(hex);

      // Clean up
      document.body.removeChild(image);
    });
  }



}
