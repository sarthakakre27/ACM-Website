const express = require("express");
const router = express.Router();
const {runCode, getStatus} = require("../controllers/compiler/compilerController");

router.post("/run", runCode);
router.get("/status", getStatus);

module.exports = router;
