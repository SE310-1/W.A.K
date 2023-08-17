import {useState} from "react"
import {useLogin} from "../../Hooks/useLogin.js"
import "./style.css"

const Index = () => {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
    }

    return (
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

            <button disabled={isLoading}>Log in</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Index