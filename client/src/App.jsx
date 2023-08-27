import {BrowserRouter, Navigate, Route, Routes,} from 'react-router-dom'
import {useAuthContext} from './hooks/useAuthContext'
import Navbar from "./Components/Navbar/index.jsx";
import Login from "./Pages/Login/index.jsx";
import Signup from "./Pages/Signup/index.jsx";
import Home from "./Pages/Home/index.jsx";
import './App.css'

import Search from "./Pages/Search/Search.jsx";
import MovieDetailsPage from "./Pages/Details/index.jsx";
import Details from "./Pages/Details/index.jsx";
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
                            element={user ? <Details/> : <Navigate to="/login"/>}
                        />
                        <Route
                            path="/search"
                            element={user ? <Search/> : <Navigate to="/login"/>}
                        />
                        <Route path="/detail/:id" element={<MovieDetailsPage/>} />
                        <Route
                            path="/login"
                            element={!user ? <Login/> : <Navigate to="/"/>}
                        />
                        <Route
                            path="/signup"
                            element={!user ? <Signup/> : <Navigate to="/"/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App;
