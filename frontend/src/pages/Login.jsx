import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const res = await API.post("auth/login/", { username, password });
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        navigate("/dashboard");
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
        alert("Login failed!");
        }
    };

    return (
        <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            /><br/>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br/>
            <button type="submit">Login</button>
        </form>
        </div>
    );
}
