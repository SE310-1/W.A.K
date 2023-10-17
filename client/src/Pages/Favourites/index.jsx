import React, { useEffect } from "react";
import { useState } from "react";
import FavouritesList from "../../Components/FavouritesList"; // import the FavouritesList component
import { useAuthContext } from "../../Hooks/useAuthContext"; // import the useAuthContext hook
import { useTheme } from "../../Hooks/useTheme";
import backgroundImage from "..//Search/img/movies.jpeg";
import "./style.css";

const Favourites = () => {
    // The actual list component content goes here
    const { user } = useAuthContext(); // get the user from the AuthContext
    const [firstMovieImage, setFirstMovieImage] = useState(null);
    const { themeColour, themeImage } = useTheme(firstMovieImage);

    return (
        <div className="home-container-search">
            <div
                className="background-image-favourites"
                style={{
                    backgroundImage: `url(${themeImage || backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div className="favourites-list">
                <h1>Favourites Page</h1>
                {user ? (
                    <FavouritesList
                        onFirstMovieChange={(movie) => {
                            // If there's a movie, set its backdrop path, otherwise set to null
                            setFirstMovieImage(
                                movie ? movie.backdrop_path : null
                            );
                        }}
                    />
                ) : (
                    <p>Please log in to see your favourites list.</p>
                )}
            </div>
        </div>
    );
};

export default Favourites;
