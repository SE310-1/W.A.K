import { Link } from 'react-router-dom';
import { useLogout } from "../../Hooks/useLogout.js";
import { useAuthContext } from '../../Hooks/useAuthContext';
import './style.css';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    };

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>W.A.K</h1>
                </Link>
                <nav>
                    {user ? (
                        <div>
                            <span>Welcome {user.username}</span>
                            <button className="button-13">
                                <Link to="/search" className="search-button">
                                    <i className="fas fa-search"></i> Search
                                </Link>
                            </button>
                            <button className="button-13" onClick={handleClick}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                            
                        </div>
                    ) : (
                        <div>
                            <div>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
