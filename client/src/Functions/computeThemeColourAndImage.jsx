import { apiKey } from "../../env.js";
import ColorThief from "colorthief";

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

  if (movieDetails != null && movieDetails.length > 0) {
    const themeImageUrl = `https://image.tmdb.org/t/p/w500/${movieDetails[0].backdrop_path}`;
    setThemeImage(themeImageUrl);

    const colorThief = new ColorThief();

    const image = document.createElement("img");
    image.setAttribute("crossOrigin", "Anonymous");
    image.setAttribute("src", themeImageUrl);
    image.style.display = "none";
    document.body.appendChild(image);
    image.addEventListener("load", async () => {
      const colour = await colorThief.getColor(image);

      const hexBody = colour.map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      }).join("");
      const hex = `#${hexBody}`;
      setThemeColour(hex);
      console.log(hex);
      document.body.removeChild(image);
    });
  }



}
