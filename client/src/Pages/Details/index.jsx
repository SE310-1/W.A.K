import React from 'react';
import './styles.css'; 
import SearchBar from '@mkyy/mui-search-bar';

const MovieDetailsPage = () => {
    // const [movieData, setMovieData] = useState(null);
    // useEffect(() => {
    //     // Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key
    //     const apiKey = 'YOUR_TMDB_API_KEY';
    //     const movieId = 'MOVIE_ID'; // Replace with the actual movie ID

    //     fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setMovieData(data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching movie data:', error);
    //         });
    // }, []);

    // if (!movieData) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div className="movie-details-container">
            <div className="movie-image">
                <img src="./movie.jpg" alt="Movie Poster" style={{ maxWidth: '100%', height: '100%' }} />
            </div>
            <div className="movie-details">
                <div className="content">
                    <div className="movie-name">Movie Name</div>
                    <div className="details-section">
                        <h2>Cast</h2>
                        <div className="movie-cast">Actor 1, Actor 2, Actor 3</div>
                    </div>
                    <div className="details-section">
                        <h2>Description</h2>
                        <div className="movie-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</div>
                    </div>
                    <div className="details-section">
                        <h2>Ratings</h2>
                        <div className="movie-ratings">IMDb: 8.5/10, Rotten Tomatoes: 90%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
