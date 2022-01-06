const {User} = require("../../models/userModel");
const passport = require("passport");

const register = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else if (user) {
            console.log("User : ", user);
            res.status(400).send("Email already exists");
        } else {
            User.register({username: req.body.username, email: req.body.email}, req.body.password, (err, user) => {
                if (err) {
                    console.log(err.message);
                    res.status(400).send("Username already exists");
                } else {
                    passport.authenticate("local")(req, res, () => {
                        res.end();
                    });
                }
            });
        }
    });
};

const logout = (req, res) => {
    req.logout();
    res.end();
};

const verify = (req, res) => {
    res.send(req.user.username);
};

module.exports = {
    register,
    logout,
    verify,
};
