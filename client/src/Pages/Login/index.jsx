import { useState } from "react";
import { useLogin } from "../../Hooks/useLogin.js";
import "./style.css";

import backgroundImage from "./img/movies.jpeg"; // Adjust the path as needed

const Index = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="home-container-login">
        <div className="background-image-login" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
        <div className="overlay-login"></div>  
        <div className="login-page">
            <form className="login" onSubmit={handleSubmit}>
                <h3>Log In</h3>

                <label>Username:</label>
                <input
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                />
                <label>Password:</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                <button className="login-button" disabled={isLoading}>Log in</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
        </div>
    );
};

export default Index;
