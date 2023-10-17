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
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [moviesData, setMoviesData] = useState<Movie[]>([]);
    const [reload, triggerReload] = useState(false);
    const [isCloseButtonHovered, setCloseButtonHovered] = useState(false);
    useEffect(() => {
        console.log(username);
        // Function to fetch user's favorite movies
        const fetchFavourites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${username}/favorites`
                );

                const favIds = response.data.map((x) => x.movieId);

                // Fetch details for each favorite movie using promises
                const movieDetailsPromises = favIds.map((movieId: number) =>
                    fetch(
                        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
                    ).then((response) => response.json())
                );

                const movieDetails = await Promise.all(movieDetailsPromises);

                setMoviesData(movieDetails);
                setIsPending(false);
            } catch (err: any) {
                setIsPending(false);
                setError(err.message);
            }
        };

        fetchFavourites(); // Invoke the fetchFavourites function when the component mounts
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
                        <img src={images.profile_image} alt={username} />
                    </div>
                    <h1 className="user-name">{username}</h1>
                </div>

                <div className="movie-slider-container">
                    {isPending && (
                        <div>
                            <h1 className="favourite-movie">
                                Top Favourite Movies
                            </h1>
                            <p className="loading">Loading...</p>
                        </div>
                    )}
                    {error && <p>Error: {error}</p>}
                    {!isPending && !error && moviesData.length > 0 && (
                        <MovieSlider movies={moviesData.slice(0, 3)} />
                    )}
                    {!isPending && !error && moviesData.length === 0 && (
                        <div>
                            <h1 className="favourite-movie">
                                Top Favourite Movies
                            </h1>
                            <div className="no-result">No Movie :( </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default FriendModal;
