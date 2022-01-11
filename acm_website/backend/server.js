require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(express.static("public"));//check needed

const {User} = require("./models/userModel");
const problem_router = require("./routes/problemRouter");
const compiler_router = require("./routes/compilerRouter");
const auth_router = require("./routes/LoginRegister");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use("/api/problems", problem_router);
app.use("/api/compiler", compiler_router);
app.use("/api", auth_router);
app.listen(PORT, () => console.log(`Server Started ${PORT} `));
