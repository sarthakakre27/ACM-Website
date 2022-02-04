import React from "react";
import Feature from "./UI/features/feature";
import Contact from "./UI/contacts/contact";

import {Link} from "react-router-dom";

function Cover() {
    return (
        <div>
            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>

            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>

            <h1>ACM COVER PAGE</h1>
            <h1>ACM COVER PAGE</h1>
            <Feature />
            <Contact />
            <Link to="problem-list">ProblemSet</Link>
        </div>
    );
}

export default Cover;
