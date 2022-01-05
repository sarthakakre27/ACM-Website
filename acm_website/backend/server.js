require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 1, // 1 hour
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static("public"));//check needed

const {User} = require("./Models/User");
const problem_router = require("./routes/problemRouter");
const compiler_router = require("./routes/compilerRouter");
const auth_router = require("./routes/LoginRegister");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/problems", problem_router);
app.use("/api/compiler", compiler_router);
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.end();
});
app.use("/api", auth_router);
app.listen(PORT, () => console.log(`Server Started ${PORT}`));
