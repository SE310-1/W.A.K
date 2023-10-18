import { apiKey } from "../../env.js";
import ColorThief from "colorthief";

/**
 * Computes the theme color and image based on the first movie's backdrop path.
 * It sets the theme image URL and extracts the dominant color from the image to be used as the theme color.
 *
 * @param {Object} user - User data (unused in this function but might be used in the broader context).
 * @param {Function} setThemeColour - Function to set the theme color in the state.
 * @param {Function} setThemeImage - Function to set the theme image in the state.
 * @param {string} firstMovieBackdropPath - Path of the backdrop image of the first movie.
 */
export const computeThemeColourAndImage = async (
    user,
    setThemeColour,
    setThemeImage,
    firstMovieBackdropPath
) => {
    // Construct the full URL of the image from the backdrop path.
    const themeImageUrl = `https://image.tmdb.org/t/p/w500/${firstMovieBackdropPath}`;

    // Set the constructed image URL as the theme image.
    setThemeImage(themeImageUrl);

    // Initialize the ColorThief class to extract dominant color from an image.
    const colorThief = new ColorThief();

    // Create an img HTML element.
    const image = document.createElement("img");

    // Set required attributes for CORS and the source of the image.
    image.setAttribute("crossOrigin", "Anonymous");
    image.setAttribute("src", themeImageUrl);

    // Hide the image, as it's only needed to extract the color.
    image.style.display = "none";

    // Add the image to the body of the document so it gets loaded.
    document.body.appendChild(image);

    // Attach a load event listener to the image.
    image.addEventListener("load", async () => {
        // Use ColorThief to extract the dominant color from the image.
        const colour = await colorThief.getColor(image);

        // Convert the RGB values of the extracted color to a hex format.
        const hexBody = colour
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex; // Ensure each channel has two characters.
            })
            .join("");

        console.log("Extracted Color:", `#${hexBody}`); // Log the extracted color.

        // Set the extracted color as the theme color.
        setThemeColour(`#${hexBody}`);

        // Remove the image from the document, as it's no longer needed.
        document.body.removeChild(image);
    });
};
