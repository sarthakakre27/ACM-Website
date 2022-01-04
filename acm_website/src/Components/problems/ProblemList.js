import React, {useState, useEffect} from "react";

import {Link} from "react-router-dom";

function ProblemList() {
    const [list, setList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/problems/get-problems")
            .then(response => response.json())
            .then(data => {
                setList(data);
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
