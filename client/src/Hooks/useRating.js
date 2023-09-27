// Defining a custom hook 'useRating'
export const useRating = () => {
    // Defining the rating function which takes username, rating, and movie as parameters
    const rating = async (username, rating, movie) => {
        // Sending a POST request to the rating endpoint of the API with the provided data
        const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}/rating`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, rating, movie }),
            }
        );

        // Parsing the JSON response from the server
        const json = await response.json();

        // Checking if the response status is not OK
        if (!response.ok) {
            // Logging any errors returned by the server
            console.log(json.error);
        } else {
            // Logging the successful JSON response from the server
            console.log(json);
        }
    };

    // Returning the rating function from the custom hook
    return { rating };
};
