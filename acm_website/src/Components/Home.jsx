import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";

const Home = () => {
	const handleLogout = () => {
		axios
			.get("/api/logout")
			.then(res => 
                console.log(res),
                setTimeout(window.location.href = '/' ,1000),

            )
			.catch(err => console.log(err));
	};

  return (
		<Button onClick={handleLogout}>
			Logout
		</Button>
  );
};

export default Home;
