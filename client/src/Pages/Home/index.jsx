import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, apiKey } from "../../../env.js";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./style.css";
import React from "react";

const Home = () => {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState({ movies: [] });
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState(null); // New state variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movies = [];
        for (let page = 1; page <= 1; page++) {
          const response = await axios.get(
            `${BASE_URL}/discover/movie?api_key=${apiKey}&page=${page}`
          );
          if (response.status === 200) {
            movies.push(...response.data.results);
          } else {
            console.error("Request failed with status:", response.status);
          }
        }
        setBackendData({ movies });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const showDetail = (movie) => {
    navigate(`/detail/${movie.id}`);
  };

  const handleCarouselChange = (selectedIndex) => {
    if (backendData?.movies[selectedIndex]?.backdrop_path) {
      const backdropUrl = `https://image.tmdb.org/t/p/original${backendData.movies[selectedIndex].backdrop_path}`;
      setCurrentBackgroundImage(backdropUrl);
    }
  };

  return (
    <div className="home-container">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${currentBackgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="overlay"></div>
      <h1 className="featured-heading">Featured Movies</h1>
      <div className="movie-details-container-home">
        <Carousel
          className="carousel"
          showArrows={true}
          emulateTouch={false}
          showStatus={false}
          showThumbs={true}
          infiniteLoop={true}
          autoPlay={false}
          onChange={handleCarouselChange}
        >
          {backendData?.movies.slice(0, 7).map((movie, i) => (
            <div className="movie-card" key={i}>
              <div
                className="movie-image-home"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
              ></div>
              <div className="movie-details-home">
                <h1 className="movie-details-title">{movie.title}</h1>
                <p className="movie-details-description">{movie.overview}</p>
                <button className="button-13" onClick={() => showDetail(movie)}>
                  More Info
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
