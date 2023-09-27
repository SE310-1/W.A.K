import { Link } from 'react-router-dom';
import { useLogout } from "../../Hooks/useLogout.js";
import { useAuthContext } from '../../Hooks/useAuthContext';
import './style.css';
import { useTheme } from '../../Hooks/useTheme.js';
import { useEffect } from 'react';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const { themeColour, themeImage } = useTheme();

    const handleClick = () => {
        logout();
    };




    const titleStyle = {
        color: themeColour
    };



    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1 style={titleStyle}>W.A.K</h1>
                </Link>
                <nav>
                    {user ? (
                        <div>
                            <span>Welcome {user.username}</span>
                            <button className="button-13">
                                <Link to="/favourites">Favourites</Link>
                            </button>
                            <button className="button-13">
                                <Link to="/search" className="search-button">
                                    <i className="fas fa-search"></i> Search
                                </Link>
                            </button>

                            <button className="button-13">
                                <Link to="/friends" className="search-button">
                                    <i className="fa-solid fa-user-group"></i> Friends
                                </Link>

                            </button>
                            <button className="button-13" onClick={handleClick}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <button className="button-13">
                                    <Link to="/login">Login</Link>
                                </button>

                                <button className="button-13">
                                    <Link to="/signup">Signup</Link>
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
