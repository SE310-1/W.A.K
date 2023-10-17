import { apiKey } from "../../env.js";
import ColorThief from "colorthief";

/**
 * This function uses the user's first favorite movie to update the app theming.
 *
 * @param {User} user The current user context
 * @param {Function} setThemeColour Function to update theme colour state
 * @param {Function} setThemeImage Function to update
 */

export const computeThemeColourAndImage = async (
    user,
    setThemeColour,
    setThemeImage,
    firstMovieBackdropPath
) => {
    const themeImageUrl = `https://image.tmdb.org/t/p/w500/${firstMovieBackdropPath}`;
    setThemeImage(themeImageUrl);

    const colorThief = new ColorThief();
    const image = document.createElement("img");
    image.setAttribute("crossOrigin", "Anonymous");
    image.setAttribute("src", themeImageUrl);
    image.style.display = "none";
    document.body.appendChild(image);

    image.addEventListener("load", async () => {
        const colour = await colorThief.getColor(image);
        const hexBody = colour
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("");
        const hex = `#${hexBody}`;
        console.log("Extracted Color:", hex); // <-- Add this line

        setThemeColour(`#${hexBody}`);
        document.body.removeChild(image);
    });
};
