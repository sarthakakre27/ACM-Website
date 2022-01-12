import {React, useState, useEffect} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {isAuthenticated} from "./Helpers";

function PrivateRoute({children}) {
    let location = useLocation();
    const [AUTH, setAUTH] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        isAuthenticated().then(result => {
            setAUTH(result);
            setLoading(false);
            console.log(AUTH);
        });
    }, []);

    if (loading) {
        return <h1></h1>;
    } else if (!loading && AUTH) {
        return children;
    } else if (!AUTH) {
        return (
            <Navigate
                to={{
                    pathname: "/Login",
                    state: {from: location},
                    replace: true,
                }}
            />
        );
    }
}

export default PrivateRoute;
