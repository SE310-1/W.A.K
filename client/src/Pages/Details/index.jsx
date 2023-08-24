import { useEffect, useState } from 'react';
import './styles.css';
import { useParams } from 'react-router-dom';
import {apiKey} from '../../../env.js';

const MovieDetailsPage = () => {
    const [movieData, setMovieData] = useState(null);
    const { id } = useParams();
    const urlParts = id.split('/');
    const movieId = urlParts[urlParts.length - 1];

    useEffect(() => {

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
