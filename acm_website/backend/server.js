require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");

const {User} = require("./Models/User");//path check
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));//check needed

const problem_router = require("./routes/problemRouter");
const compiler_router = require("./routes/compilerRouter");


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// for json
app.use(express.json());

app.use("/api/problems", problem_router);
app.use("/api/compiler", compiler_router);

const auth_router = require("./routes/LoginRegister");

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 1 // 1 hour
	}
}));

//rearrange req
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/api/login", passport.authenticate("local"),(req, res)=>{res.end()});
app.use("/api", auth_router);
app.get("/api/test",function(req, res){res.send("hello")});
app.listen(port, () => console.log("Server Started"));
//

app.listen(8000, () => console.log("Server Started"));
