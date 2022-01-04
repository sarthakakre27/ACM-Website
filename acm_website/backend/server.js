const cors = require("cors");
const express = require("express");
const passport = require("passport");
const {User} = require("./Models/User");
const port = process.env.PORT || 5000;
const session = require("express-session");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const auth_router = require("./routes/LoginRegister");

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 1 // 1 hour
	}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/api/login", passport.authenticate("local"),(req, res)=>{res.end()});
app.use("/api", auth_router);
app.get("/api/test",function(req, res){res.send("hello")});
app.listen(port, () => console.log("Server Started"));
