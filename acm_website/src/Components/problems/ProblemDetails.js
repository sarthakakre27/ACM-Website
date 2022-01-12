import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import OnlineCompiler from "../online-compiler/OnlineCompiler";

function ProblemDetails(props) {
    let params = useParams();

    const [details, setDetails] = useState({});

    useEffect(() => {
        axios
            .get(`/api/problems/problem-details/${params.id}`)
            .then(response => {
                setDetails(response.data);
                console.log(response.data);
            })
            .catch(err => console.log(err));
    }, [params.id]);

    return (
        <div>
            <p>{details[0]?.name}</p>
            <p>Problem Statement : {details[0]?.statement}</p>
            <OnlineCompiler />
        </div>
    );
}

export default ProblemDetails;
