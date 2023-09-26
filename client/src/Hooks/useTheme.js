import { useState } from "react";
import { useFavourites } from "./useFavourites";

export const useTheme = () => {
    const { favourites } = useFavourites();

    if (favourites == null || favourites.length == 0) {

    } else {
        console.log(favourites);
    }

    const [themeColour, setThemeColour] = useState("green");
    const [themeImage, setThemeImage] = useState("https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg");

    return { themeColour, themeImage };
};
