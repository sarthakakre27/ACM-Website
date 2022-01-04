const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [120, 'too big name'],
    },
    statement: {
        type: String,
        required: true,
    },
    inputStructure: {
        type: String,
        required: true,
    },
    outputStructure: {
        type: String,
        required: true,
    },
    constraints: {
        description: {
            type: String,
            required: true,
        },
        timLim: {
            type: Number,
        },
        memLim: {
            type: Number,
        }
    },
    testCases: {
        type: [{
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
        }],
        required: true,
    }

});


module.exports = mongoose.model("problem",ProblemSchema);