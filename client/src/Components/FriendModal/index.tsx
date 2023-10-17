import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./style.css";
import { images } from "../../Constants";
import axios from "axios";
import { apiKey } from "../../../env";
import MovieSlider from "../MovieSlider";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface FriendModalProps {
  username: string;
  onClose: () => void;
}

export const FriendModal: React.FC<FriendModalProps> = ({
  username,
  onClose,
}) => {
  // States to manage loading, errors, fetched data, and other interactivities
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [reload, triggerReload] = useState(false);
  const [isCloseButtonHovered, setCloseButtonHovered] = useState(false);
  const [profilePicturePath, setProfilePicturePath] = useState<String>();

  // useEffect hook to fetch data when the component mounts or when 'reload' state changes
  useEffect(() => {
    // Function to fetch user's favorite movies
    const fetchFavourites = async () => {
      try {
        // Fetch user's favorite movie IDs
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${username}/favorites`
        );
        const favIds = response.data.map((x) => x.movieId);

        // Fetch details for each favorite movie
        const movieDetailsPromises = favIds.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const movieDetails = await Promise.all(movieDetailsPromises);

        // Set the fetched movie details to the state
        setMoviesData(movieDetails);
        setIsPending(false);
      } catch (err: any) {
        // Handle errors and update the states accordingly
        setIsPending(false);
        setError(err.message);
      }
    };

    const fetchProfilePicture = async () => {
      try {
        // Fetch user's proile picture file path
        const response1 = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${username}/profilePicture`
        );
        const profilePictureID = response1.data.map((x) => x.movieId);

        // Fetch details for each favorite movie
        const profilePicturePromises = profilePictureID.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const profilePictureDetails = await Promise.all(profilePicturePromises);

        const profilePicturePath = profilePictureDetails[0].poster_path;

        setProfilePicturePath(profilePicturePath);
        console.log(profilePicturePath);
        setIsPending(false);
      } catch (err: any) {
        // Handle errors and update the states accordingly
        setIsPending(false);
        setError(err.message);
      }
    };

    // Invoke the fetch function
    fetchFavourites();
    fetchProfilePicture();
  }, [reload]);

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal">
        <p className="close-btn" onClick={onClose}>
          <img
            src={
              isCloseButtonHovered
                ? images.fill_close_button
                : images.close_button
            }
            alt="Close Button"
            onMouseEnter={() => setCloseButtonHovered(true)}
            onMouseLeave={() => setCloseButtonHovered(false)}
          />
        </p>
        <div className="user-section">
          <div className="user-avatar">
            <img
              src={`https://image.tmdb.org/t/p/w300/${profilePicturePath}`}
              alt={username}
            />
          </div>
          <h1 className="user-name">{username}</h1>
        </div>

        <div className="movie-slider-container">
          {isPending && (
            <div>
              <h1 className="favourite-movie">Top Favourite Movies</h1>
              <p className="loading">Loading...</p>
            </div>
          )}
          {error && <p>Error: {error}</p>}
          {!isPending && !error && moviesData.length > 0 && (
            <MovieSlider movies={moviesData.slice(0, 3)} username={username} />
          )}
          {!isPending && !error && moviesData.length === 0 && (
            <div>
              <h1 className="favourite-movie">Top Favourite Movies</h1>
              <div className="no-result">No Movie :( </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FriendModal;
