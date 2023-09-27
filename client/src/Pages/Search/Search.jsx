import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "@mkyy/mui-search-bar";
import MediaGrid from "../../Components/MediaGrid";
import "./style.css";
import { apiKey, BASE_URL } from "../../../env.js";
import backgroundImage from "./img/movies.jpeg";
import React from "react";

const Search = () => {
  const [backendData, setBackendData] = useState({ movies: [] });
  const [textFieldValue, setTextFieldValue] = useState(""); // Start with an empty search query
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track the initial load

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query =
          isInitialLoad || textFieldValue.trim() === ""
            ? "a"
            : textFieldValue.trim();
        const response = await axios.get(
          `${BASE_URL}/search/movie?api_key=${apiKey}&query=${query}`
        );
        if (response.status === 200) {
          setBackendData({ movies: response.data.results });
        } else {
          console.error("Request failed with status:", response.status);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [textFieldValue, isInitialLoad]);

  useEffect(() => {
    // Filter movies based on textFieldValue
    const filtered = backendData.movies.filter((movie) =>
      movie.title.toLowerCase().includes(textFieldValue.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [textFieldValue, backendData.movies]);

  useEffect(() => {
    // After the initial load, set isInitialLoad to false
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  return (
    <div className="home-container-search">
      <div
        className="background-image-search"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="overlay-search"></div>
      {/* <div className="page"> */}
      <SearchBar
        style={{
          color: "black",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #ccc",
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "999",
        }}
        value={textFieldValue}
        onChange={(newValue) => {
          setTextFieldValue(newValue);
        }}
        placeholder="Search Movie"
      />

      <div className="movie-list">
        <MediaGrid medias={filteredMovies} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Search;
