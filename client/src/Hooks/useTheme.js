import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { computeThemeColourAndImage } from "../Functions/computeThemeColourAndImage";


export const useTheme = () => {

    const { user } = useAuthContext();

    const [themeColour, setThemeColour] = useState("#FFFFFF");
    const [themeImage, setThemeImage] = useState("https://cdn.shopify.com/s/files/1/0307/6161/5496/files/dreamstime_xxl_96711049.jpg")


    // Check if the user is logged in
    if (user) {
        // Only can get favorites if the user is logged in
        // Even if the user is logged in their favorites list may still be empty
        computeThemeColourAndImage(user, setThemeColour, setThemeImage);

    }

    return { themeColour, themeImage };
};
