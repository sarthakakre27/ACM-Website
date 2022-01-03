import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage";
import Home from "./Home";

const RoutesList = () => {
  return (
    <Router>
      <Routes>
				<Route exact path="/" element={<LoginPage />} />
        <Route exact path="/:username" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default RoutesList;
