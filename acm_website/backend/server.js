const cors = require("cors");
const express = require("express");
const passport = require("passport");
const {User} = require("./Models/User");
const port = process.env.PORT || 5000;
const session = require("express-session");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

// Verify authentication in routes
app.get("/api/verify", (req, res) => {
	if(req.isAuthenticated()) {
		res.send(req.user.username);
	}
	else {
		res.status(403).send("Session expired");
	}
});

// Register a new user
app.post("/api/register", (req, res) => {
	User.findOne({ email : req.body.email }, (err, user) => {
		if (err) {
			res.status(500).send(err);
		}
		else if (user) {
			res.status(400).send("Email already exists");
		}
		else {
			User.register({username: req.body.username, email: req.body.email}, req.body.password, (err, user) => {
				if(err) {
					console.log(err.message);
					res.status(400).send("Username already exists");
				}
				else {
					passport.authenticate("local")(req, res, () => {
						res.end();
					});
				}
			});
		}
	})
});

// Login
app.post("/api/login", passport.authenticate("local", { failureFlash: "Invalid username or password." }), (req, res) => {
	res.end();
});

// Logout
app.get("/api/logout", (req, res) => {
	req.logout();
	res.end();
});

// Listen to a specific port
app.listen(port, () => {
	console.log("Server running on port " + port);
});
