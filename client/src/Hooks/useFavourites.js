import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../../env";

export const useFavourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    const fetchData = async (url, options = {}, onSuccess) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${user.token}` },
                ...options,
            });
            const json = await response.json();
            if (response.ok) {
                onSuccess(json);
            } else {
                setError(json.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData(`${BASE_URL}/favorites`, {}, (json) =>
                setFavourites(json)
            );
        }
    }, [user]);

    const addFavourite = async (movieId) => {
        await fetchData(
            `${BASE_URL}/favorites/add/${movieId}`,
            { method: "POST" },
            () => setFavourites((prev) => [...prev, movieId])
        );
    };

    const removeFavourite = async (movieId) => {
        await fetchData(
            `${BASE_URL}/favorites/remove/${movieId}`,
            { method: "DELETE" },
            () => setFavourites((prev) => prev.filter((id) => id !== movieId))
        );
    };

    const isFavourite = async (movieId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/favorites/isFavorite/${movieId}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            const json = await response.json();
            if (!response.ok) throw new Error(json.error);
            return json.message === "Movie in favorites";
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return {
        favourites,
        loading,
        error,
        addFavourite,
        removeFavourite,
        isFavourite,
    };
};
