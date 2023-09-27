import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { computeThemeColourAndImage } from "../Functions/computeThemeColourAndImage";


export const useTheme = () => {

    const { user } = useAuthContext();

    const [themeColour, setThemeColour] = useState("#FFFFFF");
    const [themeImage, setThemeImage] = useState("");


    useEffect(() => {
        if (user) {
            computeThemeColourAndImage(user, setThemeColour, setThemeImage);
        }

    }, [user, themeColour, themeImage]);


    return { themeColour, themeImage };
};
