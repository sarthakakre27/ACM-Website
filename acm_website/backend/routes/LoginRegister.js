
const express = require("express");
const router = express.Router();
const {register,verify,login,resetPassword,forgotPassword} = require("../controllers/LoginRegister/LoginRegister");
const auth = require("../middleware/auth");
router.post("/register", register);
router.post("/login", login);
// router.get("/logout", logout);
router.get("/verify", auth, verify);
// features added
router.post("/resetPassword", auth, resetPassword); // write code in frontend
router.post("/forgotPassword", auth, forgotPassword); // write code in frontend

module.exports = router;