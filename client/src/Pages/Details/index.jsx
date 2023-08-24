import React, { useEffect, useState } from 'react';
import './styles.css'; 
import SearchBar from '@mkyy/mui-search-bar';
import ReactStars from 'react-stars'
import { render } from 'react-dom'
import {useAuthContext} from '../../Hooks/useAuthContext.js'
import{useRating} from "../../Hooks/useRating.js";

const MovieDetailsPage = () => {
    const [movieData, setMovieData] = useState(null);
    const { user } = useAuthContext()
    const{rating} = useRating()

    useEffect(() => {
        const apiKey = '8e66d594db8136414e394600886d8cab'; 
        const movieId = 'tt0468569'; 

        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
            .then(response => response.json())
            .then(data => {
                setMovieData(data);
            })
            .catch(error => {
                console.error('Error fetching movie data:', error);
            });
    }, []);

    if (!movieData) {
        return <div>Loading...</div>;
    }

    const ratingChanged = async (newRating) => {
        // console.log(newRating)
        // console.log(user.username)
        // console.log(movieData.title)
        await rating(user.username, newRating, movieData.title)
    }
    return (
        <div className="movie-details-container">
            <div className="movie-image">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                    alt={movieData.title}
                    style={{ maxWidth: '100%', height: '100%' }}
                />
            </div>
            <div className="movie-details">
                <div className="content">
                    <div className="movie-name">{movieData.title}</div>
                    <div className="details-section">
                        <h2>Cast</h2>
                        <div className="movie-cast">Actor 1, Actor 2, Actor 3</div>
                    </div>
                    <div className="details-section">
                        <h2>Description</h2>
                        <div className="movie-description">{movieData.overview}</div>
                    </div>
                    <div className="details-section">
                        <h2>Ratings</h2>
                        <div className="movie-ratings">
                            IMDb: {movieData.vote_average}/10, Popularity: {movieData.popularity}
                        </div>
                        <div>
                            <h2>Your rating</h2>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                color2={'#ffd700'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
