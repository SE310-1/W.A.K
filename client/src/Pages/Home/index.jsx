import {useEffect, useState} from "react";
import axios from "axios";

const Index = () => {
    const [backendData, setBackendData] = useState([{}])

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                `${import.meta.env.VITE_BASE_API_URL}/test`,
            );
            return result.data;
        };
        fetchData().then(r => setBackendData(r));
    }, []);

    return (
        <>
            {backendData.movies && backendData.movies.map((movie, i) => (
                <div key={i}>
                    <h1>{movie}</h1>
                </div>
            ))}
        </>
    )
}

export default Index