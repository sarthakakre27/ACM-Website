const express = require("express");
const cors = require("cors");

const {generateFile} = require("./helpers/generateFile");
const {addJobToQueue} = require("./helpers/jobQueue");
const Job = require("../../models/jobModel");

const runCode = async (req, res) => {
    // console.log("Geeting it");
    const {language = "cpp", code, input = "", probID} = req.body;
    if (code === undefined) {
        return res.status(400).json({success: false, error: "Empty code body!"});
    }
    const {filepath, folderPath} = await generateFile(language, code, input);
    const job = await new Job({language, filepath, input, probID}).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);
    res.status(201).json({jobId});
};

const getStatus = async (req, res) => {
    const jobId = req.query.id;
    if (jobId === undefined) {
        return res.status(400).json({success: false, error: "missing id query param"});
    }
    const job = await Job.findById(jobId);
    if (job === undefined) {
        return res.status(400).json({success: false, error: "couldn't find job"});
    }
    return res.status(200).json({success: true, job});
};

module.exports = {
    runCode,
    getStatus,
};
