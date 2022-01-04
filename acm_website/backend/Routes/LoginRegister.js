
const express = require("express");
const router = express.Router();
const {register,logout,verify} = require("../controllers/LoginRegister/LoginRegister");
const auth = require("../middleware/auth");
router.post("/register", register);
// router.post("/api/login", passport.authenticate("local"), (req, res) => {res.end()});
router.get("/logout", logout);
router.get("/verify", auth, verify);

module.exports = router;