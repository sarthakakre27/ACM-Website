import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import OnlineCompiler from "../online-compiler/OnlineCompiler";

function ProblemDetails(props) {
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
