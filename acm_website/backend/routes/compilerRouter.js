const express = require("express");
const router = express.Router();
const {runCode, getStatus} = require("../controllers/compiler/compilerController");

router.get("/run", runCode);
router.get("/status", getStatus);

module.exports = router;
