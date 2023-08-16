import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";
import SearchBarComponent from './Components/searchBar';

function App() {
    const [backendData, setBackendData] = useState([{}])

    useEffect( () => {
        const fetchData = async () => {
            const result = await axios(
                `${import.meta.env.VITE_BASE_API_URL}/test`,
            );
            return result.data;
        };
        fetchData().then(r => setBackendData(r));
    }, []);

    return (
        <div>
            <SearchBarComponent />
            {backendData.movies && backendData.movies.map((movie, i) => (
                <div key={i}>
                    <h1>{movie}</h1>
                </div>
            ))}
        </div>
        
    )
}

export default App
