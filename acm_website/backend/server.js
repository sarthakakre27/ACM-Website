require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const problem_router = require("./routes/problemRouter");
const compiler_router = require("./routes/compilerRouter");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// for json
app.use(express.json());

app.use("/api/problems", problem_router);
app.use("/api/compiler", compiler_router);

app.listen(8000, () => console.log("Server Started"));
