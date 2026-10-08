import { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Login Successful!");

            navigate("/");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Invalid email or password"
            );
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-box">

                <h2>Real Estate Login</h2>

                <p>
                    Login to manage your properties
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="auth-link">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

                <Link to="/">
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Login;