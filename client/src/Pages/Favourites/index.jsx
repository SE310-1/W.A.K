import React from 'react';
import FavouritesList from '../../Components/FavouritesList'; // import the FavouritesList component
import { useAuthContext } from '../../Hooks/useAuthContext'; // import the useAuthContext hook

const Favourites = () => {
  const { user } = useAuthContext(); // get the user from the AuthContext

  return (
    <div className="favourites-page">
      <h1>Favourites Page</h1>
      {user ? ( // check if user is not null
        <FavouritesList /> // render the FavouritesList component
      ) : (
        <p>Please log in to see your favourites list.</p> // show a message asking the user to log in
      )}
    </div>
  );
};

export default Favourites;
