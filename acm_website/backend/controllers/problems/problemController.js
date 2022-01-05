const mongoose = require("mongoose");
const Problem = require("../../models/problemModel");

const getProblemName = async (req, res) => {
    try {
        projection_doc = {name: 1, _id: 1};
        const problems = await Problem.find({}, projection_doc);
        res.json(problems);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const getProblemDetails = async (req, res) => {
    console.log(req.params.id);
    try {
        const problem = await Problem.find({
            _id: mongoose.Types.ObjectId(req.params.id),
        });
        res.json(problem);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    getProblemDetails,
    getProblemName,
};
