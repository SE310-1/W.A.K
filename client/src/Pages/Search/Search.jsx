import {useEffect, useState} from "react";
import axios from "axios";
import SearchBar from "@mkyy/mui-search-bar";
import MediaGrid from "../../Components/MediaGrid";
import './style.css';
import {apiKey, BASE_URL} from '../../../env.js';

const Search = () => {
    const [backendData, setBackendData] = useState({movies: []});
    const [textFieldValue, setTextFieldValue] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (textFieldValue.trim() !== "") {
                    const response = await axios.get(
                        `${BASE_URL}/search/movie?api_key=${apiKey}&query=${textFieldValue}`
                    );
                    if (response.status === 200) {
                        setBackendData({movies: response.data.results});
                    } else {
                        console.error("Request failed with status:", response.status);
                    }
                } else {
                    setBackendData({movies: []});
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        fetchData();
    }, [textFieldValue]);

    useEffect(() => {
        // Filter movies based on textFieldValue
        const filtered = backendData.movies.filter((movie) =>
            movie.title.toLowerCase().includes(textFieldValue.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [textFieldValue, backendData.movies]);

    return (
        <div>
            <SearchBar
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    top: "3.5vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    position: "fixed",
                }}
                value={textFieldValue}
                onChange={(newValue) => {
                    setTextFieldValue(newValue);
                }}
                placeholder="Search Movie"
            />
            <div className="movie-list">
                <MediaGrid medias={filteredMovies}/>
            </div>
        </div>
    );
};

export default Search;
