import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {useEffect} from "react";

const Home = () => {
    useEffect(() => {
        // Send access token through authorization header
        let accessToken = localStorage.getItem("accessToken");
        let requestOptions = null;

        if (accessToken) {
            requestOptions = {headers: {authorization: `Bearer ${accessToken}`}};
            JSON.stringify(requestOptions);
        }

        axios
            .get("/api/verify", requestOptions)
            .then(res => {
                const userName = res.data;
            })
            .catch(err => {
                console.log(err);
                window.location.href = "/login";
            });
    });

    const handleLogout = () => {
        // axios
        //     .get("/api/logout")
        //     .then(
        //         res => console.log(res),
        //         setTimeout(() => {
        //             window.location.href = "/Login";
        //         }, 1000)
        //     )
        //     .catch(err => console.log(err));

        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default Home;
