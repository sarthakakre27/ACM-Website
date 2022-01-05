import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import OnlineCompiler from "../online-compiler/OnlineCompiler";
import Loader from "react-loader-spinner";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function ProblemDetails(props) {
    let location = useLocation();
    let params = useParams();

    const [details, setDetails] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8000/api/problems/problem-details/${params.id}`)
            .then(response => response.json())
            .then(data => {
                setDetails(data);
                console.log(data);
            })
            .catch(err => console.log(err));
    }, [location]);

    return (
        <div>
            <p>{details[0]?.name}</p>
            <p>Problem Statement : {details[0]?.statement}</p>
            <OnlineCompiler />
        </div>
    );
}

export default ProblemDetails;
