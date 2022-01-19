import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Cover from "./Components/Cover";
import OnlineCompiler from "./Components/online-compiler/OnlineCompiler";
import ProblemDetails from "./Components/problems/ProblemDetails";
import ProblemList from "./Components/problems/ProblemList";
import LoginPage from "./Components/Login/LoginPage";
import Home from "./Components/Login/Home";
import PrivateRoute from "./Components/auth/PrivateRoute";
import HomeScreen from "./Components/Codepen/HomeScreen";
import Editor from "./Components/Codepen/Editor";

function SiteRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Cover />} />
                <Route path="/login" exact element={<LoginPage />} />
                <Route
                    path="/home"
                    exact
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route path="/problem-details/:id" exact element={<ProblemDetails />} />
                <Route path="/problem-list" exact element={<ProblemList />} />
                <Route path="/compiler" exact element={<OnlineCompiler />} />
                <Route path="/codepen" element={<HomeScreen />} />
                <Route path="/codepen/projects/:id" exact element={<Editor/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default SiteRouter;
