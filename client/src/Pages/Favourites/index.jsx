import React from "react";
import FavouritesList from "../../Components/FavouritesList";
import backgroundImage from "..//Search/img/movies.jpeg";
import "./style.css";

const Favourites = () => {
  // The actual list component content goes here

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
        <FavouritesList />
      </div>
    </div>
  );
};

export default Favourites;
