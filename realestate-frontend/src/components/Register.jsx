import { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name,
                    email: email,
                    password: password,
                    role: "CUSTOMER"
                }
            );

            alert(
                "Registration successful! Please login."
            );

            navigate("/login");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Registration failed"
            );
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-box">

                <h2>Create Account</h2>

                <p>
                    Register for Real Estate Management
                </p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

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
                        Register
                    </button>

                </form>

                <p className="auth-link">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

                <Link to="/">
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Register;