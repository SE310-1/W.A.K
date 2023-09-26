import { useState } from "react";

export const useTheme = () => {
    const [themeColour, setThemeColour] = useState("#FFFFFF");
    const [themeImage, setThemeImage] = useState("");
};
