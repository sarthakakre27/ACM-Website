import React from "react";
import {Route, Switch, BrowserRouter} from "react-router-dom";
import Cover from "./Components/Cover";
import OnlineCompiler from "./Components/online-compiler/OnlineCompiler";
import ProblemDetails from "./Components/problems/ProblemDetails";
import ProblemList from "./Components/problems/ProblemList";

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Cover} />
                <Route path="/problem-details/:id" exact component={ProblemDetails} />
                <Route path="/problem-list" exact component={ProblemList} />
                <Route path="/compiler" exact component={OnlineCompiler} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
