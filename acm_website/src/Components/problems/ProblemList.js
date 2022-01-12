import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function ProblemList() {
    const [list, setList] = useState([]);

    useEffect(() => {
        // Send access token through authorization header
        axios
            .get("/api/problems/get-problems")
            .then(res => {
                console.log(res);
                setList(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            {list.map(function (item) {
                return (
                    <Link
                        key={item._id}
                        to={{
                            pathname: `/problem-details/${item._id}`,
                            id: item._id,
                        }}>
                        {item.name}
                    </Link>
                );
            })}
        </div>
    );
}

export default ProblemList;
