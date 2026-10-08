import { useEffect, useState } from "react";

import axios from "axios";

import {
    Link,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";


const API_URL =
    "http://localhost:8080/api/properties";


function Home() {

    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);

    const [formData, setFormData] = useState({

        title: "",
        description: "",
        location: "",
        price: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        status: "AVAILABLE"

    });

    const [editingId, setEditingId] = useState(null);

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user")
        )
    );


    // Get all properties
    const fetchProperties = async () => {

        try {

            const response =
                await axios.get(API_URL);

            setProperties(response.data);

        } catch (error) {

            console.error(
                "Error fetching properties:",
                error
            );
        }
    };


    useEffect(() => {

        fetchProperties();

    }, []);


    // Input change
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });
    };


    // Add or Update property
    const handleSubmit = async (e) => {

        e.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login before managing properties."
            );

            navigate("/login");

            return;
        }


        const propertyData = {

            title: formData.title,

            description: formData.description,

            location: formData.location,

            price: Number(formData.price),

            propertyType:
                formData.propertyType,

            bedrooms:
                Number(formData.bedrooms),

            bathrooms:
                Number(formData.bathrooms),

            area:
                Number(formData.area),

            status:
                formData.status
        };


        try {

            if (editingId) {

                await axios.put(

                    `${API_URL}/${editingId}`,

                    propertyData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Property updated successfully!"
                );

            } else {

                await axios.post(

                    API_URL,

                    propertyData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Property added successfully!"
                );
            }


            resetForm();

            fetchProperties();

        } catch (error) {

            console.error(error);

            if (
                error.response?.status === 401
            ) {

                alert(
                    "Session expired. Please login again."
                );

                handleLogout();

            } else {

                alert(
                    "Operation failed."
                );
            }
        }
    };


    // Edit property
    const handleEdit = (property) => {

        setEditingId(property.id);

        setFormData({

            title: property.title,

            description:
                property.description || "",

            location:
                property.location,

            price:
                property.price,

            propertyType:
                property.propertyType,

            bedrooms:
                property.bedrooms,

            bathrooms:
                property.bathrooms,

            area:
                property.area,

            status:
                property.status
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // Delete property
    const handleDelete = async (id) => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login before deleting properties."
            );

            navigate("/login");

            return;
        }


        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this property?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            await axios.delete(

                `${API_URL}/${id}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Property deleted successfully!"
            );

            fetchProperties();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete property."
            );
        }
    };


    // Reset form
    const resetForm = () => {

        setEditingId(null);

        setFormData({

            title: "",
            description: "",
            location: "",
            price: "",
            propertyType: "",
            bedrooms: "",
            bathrooms: "",
            area: "",
            status: "AVAILABLE"

        });
    };


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        alert("Logged out successfully!");

        navigate("/");
    };


    return (

        <div>


            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">
                    <h2>
                        RealEstate
                    </h2>
                </div>


                <div className="nav-links">

                    <a href="#home">
                        Home
                    </a>

                    <a href="#properties">
                        Properties
                    </a>

                    <a href="#about">
                        About
                    </a>


                    {user ? (

                        <>

                            <span className="welcome">
                                Hi, {user.name}
                            </span>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <Link to="/login">

                            <button className="login-btn">
                                Login
                            </button>

                        </Link>

                    )}

                </div>

            </nav>



            {/* HERO */}

            <section
                className="hero"
                id="home"
            >

                <div className="hero-content">

                    <h1>
                        Find Your Dream Property
                    </h1>

                    <p>
                        Discover the perfect home,
                        apartment or property
                        for your future.
                    </p>

                    <a
                        href="#properties"
                        className="hero-btn"
                    >
                        Explore Properties
                    </a>

                </div>

            </section>



            {/* PROPERTY FORM */}

            {user && (

                <section className="property-form-section">

                    <h2>

                        {editingId
                            ? "Edit Property"
                            : "Add New Property"}

                    </h2>


                    <form
                        className="property-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            name="title"
                            placeholder="Property Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />


                        <input
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />


                        <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />


                        <select
                            name="propertyType"
                            value={
                                formData.propertyType
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Property Type
                            </option>

                            <option value="Apartment">
                                Apartment
                            </option>

                            <option value="Villa">
                                Villa
                            </option>

                            <option value="House">
                                House
                            </option>

                            <option value="Plot">
                                Plot
                            </option>

                            <option value="Commercial">
                                Commercial
                            </option>

                        </select>


                        <input
                            name="bedrooms"
                            type="number"
                            placeholder="Bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                        />


                        <input
                            name="bathrooms"
                            type="number"
                            placeholder="Bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                        />


                        <input
                            name="area"
                            type="number"
                            placeholder="Area in sq.ft"
                            value={formData.area}
                            onChange={handleChange}
                        />


                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="AVAILABLE">
                                Available
                            </option>

                            <option value="SOLD">
                                Sold
                            </option>

                            <option value="RENTED">
                                Rented
                            </option>

                        </select>


                        <textarea
                            name="description"
                            placeholder="Property Description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                        />


                        <div className="form-buttons">

                            <button type="submit">

                                {editingId
                                    ? "Update Property"
                                    : "Add Property"}

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </section>

            )}



            {/* PROPERTIES */}

            <section
                className="properties-section"
                id="properties"
            >

                <h2>
                    Available Properties
                </h2>

                <p className="section-subtitle">
                    Explore our latest property listings
                </p>


                <div className="property-grid">

                    {properties.length === 0 ? (

                        <p>
                            No properties available.
                        </p>

                    ) : (

                        properties.map(
                            (property) => (

                                <div
                                    className="property-card"
                                    key={property.id}
                                >

                                    <div className="property-image">
                                        🏠
                                    </div>


                                    <div className="property-content">

                                        <h3>
                                            {property.title}
                                        </h3>

                                        <p>
                                            📍 {property.location}
                                        </p>

                                        <h4>
                                            ₹ {property.price}
                                        </h4>

                                        <p>
                                            Type:
                                            {" "}
                                            {property.propertyType}
                                        </p>

                                        <p>
                                            🛏️
                                            {" "}
                                            {property.bedrooms}
                                            {" "}
                                            Bedrooms
                                        </p>

                                        <p>
                                            🛁
                                            {" "}
                                            {property.bathrooms}
                                            {" "}
                                            Bathrooms
                                        </p>

                                        <p>
                                            📐
                                            {" "}
                                            {property.area}
                                            {" "}
                                            sq.ft
                                        </p>

                                        <p>
                                            Status:
                                            {" "}
                                            {property.status}
                                        </p>

                                        <p className="description">
                                            {
                                                property.description
                                            }
                                        </p>


                                        {user && (

                                            <div className="card-buttons">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(
                                                            property
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            property.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            </section>



            {/* ABOUT */}

            <section
                className="about-section"
                id="about"
            >

                <h2>
                    About Our System
                </h2>

                <p>
                    The Real Estate Management System
                    provides a centralized platform for
                    managing properties, users and
                    property information efficiently.
                </p>

                <p>
                    The application is developed using
                    React for the frontend, Spring Boot
                    for the backend and MySQL for
                    database management.
                </p>

            </section>



            {/* FOOTER */}

            <footer>

                <p>
                    © 2026 Real Estate Management System
                </p>

            </footer>

        </div>
    );
}



function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

        </Routes>
    );
}


export default App;