import React from "react";
import FavouritesList from "../../Components/FavouritesList"; // import the FavouritesList component
import { useAuthContext } from "../../Hooks/useAuthContext"; // import the useAuthContext hook
import backgroundImage from "..//Search/img/movies.jpeg";
import "./style.css";

const Favourites = () => {
  // The actual list component content goes here
  const { user } = useAuthContext(); // get the user from the AuthContext
  return (
    <div className="home-container-search">
      <div
        className="background-image-favourites"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="favourites-list">
            <h1>Favourites Page</h1>
            {user ? ( // check if user is not null
                <FavouritesList /> // render the FavouritesList component
            ) : (
                <p>Please log in to see your favourites list.</p> // show a message asking the user to log in
            )}
        </div>
    </div>
  );
};

export default Favourites;
