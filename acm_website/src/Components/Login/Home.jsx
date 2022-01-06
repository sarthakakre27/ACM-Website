import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {useEffect} from "react";

const Home = () => {

    useEffect(() => {
        axios
            .get("/api/verify", {
                headers: {
                    "content-type": "application/json",
                },
            })
            .then(res => {
                const userName = res.data;
                
            })
            .catch(err => {
                console.log(err);
                window.location.href = "/login";
            });
    });

    const handleLogout = () => {
        
        axios
            .get("/api/logout")
            .then(
                res => console.log(res),
                setTimeout(() => {
                    window.location.href = "/Login";
                }, 1000)
            )
            .catch(err => console.log(err));
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default Home;
