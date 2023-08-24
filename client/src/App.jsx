import {BrowserRouter, Navigate, Route, Routes,} from 'react-router-dom'
import {useAuthContext} from './hooks/useAuthContext'
import Navbar from "./Components/Navbar/index.jsx";
import Login from "./Pages/Login/index.jsx";
import Signup from "./Pages/Signup/index.jsx";
import Home from "./Pages/Home/index.jsx";
import './App.css'
import MovieDetailsPage from './Pages/Details';

function App() {
    const {user} = useAuthContext()

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <div className="pages">
                    <Routes>
                        <Route
                            path="/"
                            element={<Home/>}
                        />
                        <Route
                            path="/login"
                            element={ <Login/>}
                        />
                        <Route
                            path="/signup"
                            element={<Signup/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App;