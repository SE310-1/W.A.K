import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_KEY } from "../../../env.js";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./style.css";

const Index = () => {

    const [backendData, setBackendData] = useState({ movies: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movies = [];
                for (let page = 1; page <= 1; page++) {
                    const response = await axios.get(
                        `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`
                    );
                    if (response.status === 200) {
                        movies.push(...response.data.results);
                        console.log('movies', movies);
                    } else {
                        console.error('Request failed with status:', response.status);
                    }
                }
                setBackendData({ movies });
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array, only fetch data once

    return (
        <>
            <Carousel showArrows={false} emulateTouch={true} showStatus={false} showThumbs={false} infiniteLoop={true}>
                {backendData?.movies.slice(0, 8).map((movie, i) => (
                    <div className="movie-card" key={i}>
                        <div className="movie-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
                        </div>
                        <div className="movie-details">
                            <h1 className="movie-details-title">{movie.title}</h1>
                            <p className="movie-details-description">{movie.overview}</p>
                            <button>More Info</button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </>
    );
}

export default Index;
