const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const {User} = require("../../models/userModel");
const crypto = require("crypto");
const PASSWORD_LENGTH = 18;
const LOWERCASE_ALPHABET = "abcdefghijklmnopqrstuvwxyz"; // 26 chars
const UPPERCASE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 chars
const NUMBERS = "0123456789"; // 10 chars
const SYMBOLS = ",./<>?;'\":[]\\|}{=-_+`~!@#$%^&*()"; // 32 chars
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars

function generateRandomPassword(length, alphabet) {
    var rb = crypto.randomBytes(length);
    var rp = "";
    for (var i = 0; i < length; i++) {
        rb[i] = rb[i] % alphabet.length;
        rp += alphabet[rb[i]];
    }
    return rp;
}
const generateAccessToken = data => {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: process.env.TOKEN_LIFE});
    return token;
};

const register = (req, res) => {
    // Check if username already exists
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        } else if (user) {
            res.status(400).send("Username already exists");
        } else {
            User.findOne({username: req.body.username}, (err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Internal server error");
                } else if (user) {
                    res.status(400).send("Username already exists");
                } else {
                    // Hash password
                    bcrypt.hash(req.body.password, saltRounds, (err_hash, hashPassword) => {
                        if (err_hash) {
                            console.error(err_hash);
                            res.status(500).send("Internal server error");
                        } else {
                            const user = new User({
                                username: req.body.username,
                                password: hashPassword,
                                email: req.body.email,
                            });

                            // Save user to database
                            user.save(err_save => {
                                if (err_save) {
                                    console.error(err_save);
                                    res.status(500).send("Internal server error");
                                } else {
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

const resetPassword = (req, res) => {
    // Check if username exists
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        } else if (!user) {
            res.status(400).send("Username does not exist");
        } else {
            // Hash password
            bcrypt.hash(req.body.newPassword, saltRounds, (err_hash, hashPassword) => {
                if (err_hash) {
                    console.error(err_hash);
                    res.status(500).send("Internal server error");
                } else {
                    // Update password
                    bcrypt.compare(req.body.existingPassword, user.password, (err_cmp, result) => {
                        if (err_cmp) {
                            res.status(400).send("Incorrect password");
                        } else {
                            User.updateOne({username: req.body.username}, {password: hashPassword}, err_update => {
                                if (err_update) {
                                    console.error(err_update);
                                    res.status(500).send("Internal server error");
                                } else {
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

const forgotPassword = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        } else if (user) {
            const nodemailer = require("nodemailer");

            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "proclubvnit@gmail.com",
                    pass: process.env.GMAIL_PASSWORD,
                },
            });

            const password = generateRandomPassword(PASSWORD_LENGTH, ALL_CHARS);
            bcrypt.hash(password, saltRounds, (err_hash, hashPassword) => {
                if (err_hash) {
                    console.error(err_hash);
                    res.status(500).send("Internal server error");
                } else {
                    User.updateOne({email: req.body.email}, {password: hashPassword}, err_update => {
                        if (err_update) {
                            console.error(err_update);
                            res.status(500).send("Internal server error");
                        } else {
                            const mailDetails = {
                                from: "proclubvnit@gmail.com",
                                to: user.email,
                                subject: "Reset Password - ACM VNIT",
                                text: `Hey!, ${password} is your new password`,
                            };

                            mailTransporter.sendMail(mailDetails, (err, data) => {
                                if (err) {
                                    console.log("Error Occurs");
                                } else {
                                    console.log("Email sent successfully");
                                    res.status(200).send("Email sent successfully");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// const logout = (req, res) => {
//     req.logout();
//     res.end();
// };

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username exists
    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        } else {
            if (foundUser) {
                // Compare password
                bcrypt.compare(password, foundUser.password, (err_cmp, result) => {
                    if (err_cmp) {
                        console.error(err_cmp);
                        res.status(500).send("Internal server error");
                    } else if (result) {
                        // Password matched
                        const accessToken = generateAccessToken({name: username});
                        res.send({username: username, accessToken: accessToken});
                    } else {
                        res.status(401).send("Please provide a valid username and password.");
                    }
                });
            } else {
                res.status(401).send("Please provide a valid username and password.");
            }
        }
    });
};

const verify = (req, res) => {
    res.send(req.currentUserName);
};

module.exports = {
    register,
    verify,
    login,
    resetPassword,
    forgotPassword,
};
