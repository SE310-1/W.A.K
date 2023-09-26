import { useState } from "react";
import { useFavourites } from "./useFavourites";

export const useTheme = () => {
    const [themeColour, setThemeColour] = useState("#FFFFFF");
    const [themeImage, setThemeImage] = useState("");
    // const { favourites, loading, error, addFavourite, removeFavourite, isFavourite } = useFavourites();

    setThemeColour("#000000");
    setThemeImage("https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg");

    return { themeColour, themeImage };
};
