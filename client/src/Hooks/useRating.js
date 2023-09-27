import axios from "axios";

// Defining a custom hook 'useRating'
export const useRating = () => {
    // Defining the rating function which takes username, rating, and movie as parameters
    const rating = async (username, rating, movie) => {
        try {
            // Sending a POST request to the rating endpoint of the API with the provided data
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_API_URL}/rating`,
                { username, rating, movie }
            );
            // Return the response data to the caller
            return response.data;
        } catch (error) {
            // If an error occurs, throw it to the caller
            throw error.response
                ? error.response.data
                : new Error("An error occurred while rating the movie");
        }
    };

    // Returning the rating function from the custom hook
    return { rating };
};
