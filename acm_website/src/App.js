import React from "react";
import SiteRouter from "./Router";
import axios from "axios";
// import "./App.css";

if (localStorage.getItem("accessToken") !== null) {
    const AUTH_TOKEN = localStorage.getItem("accessToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;
}

axios.defaults.headers.post["Content-Type"] = "application/json";

// axios.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response.status === 401 || error.response.status === 403) {
//             localStorage.removeItem("accessToken");
//             window.location.href = "/Login";
//         }
//         return error;
//     }
// );

function App() {
    return (
        <React.Fragment>
            <SiteRouter />
        </React.Fragment>
    );
}

export default App;
