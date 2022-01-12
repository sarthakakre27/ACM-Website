import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {useEffect} from "react";

const Home = () => {
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default Home;
