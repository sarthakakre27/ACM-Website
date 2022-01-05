import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Cover from "./Components/Cover";
import OnlineCompiler from "./Components/online-compiler/OnlineCompiler";
import ProblemDetails from "./Components/problems/ProblemDetails";
import ProblemList from "./Components/problems/ProblemList";
import LoginPage from "./Components/Login/LoginPage";
import Home from "./Components/Login/Home";

function SiteRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Cover />} />
                <Route path="/login" exact element={<LoginPage />} />
                <Route path="/:username" exact element={<Home />} />
                <Route path="/problem-details/:id" exact element={<ProblemDetails />} />
                <Route path="/problem-list" exact element={<ProblemList />} />
                <Route path="/compiler" exact element={<OnlineCompiler />} />
            </Routes>
        </BrowserRouter>
    );
}

export default SiteRouter;
