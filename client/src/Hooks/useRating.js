export const useRating = () => {
    const rating = async(username, rating, movie) =>{
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rating`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, rating, movie})
        })
        const json = await response.json()

        if (!response.ok) {
            console.log(json.error)
        }
        else{
            console.log(json)
        }
    }
    return{rating}
}