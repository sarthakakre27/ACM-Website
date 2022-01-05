const fs = require("fs");
const path = require("path");
const Queue = require("bull");
const mongoose = require("mongoose");
const outputs = path.join(__dirname, "outputs");

const Job = require("../../../models/jobModel");
const Problem = require("../../../models/problemModel");
const {executeCode} = require("./executeCode");
const {Mongoose} = require("mongoose");

const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;
const DEFAULT_MEM_LIMIT = 70000000; // 700MB by default, unless overruled by problem

jobQueue.process(NUM_WORKERS, async ({data}) => {
    const jobId = data.id;
    const job = await Job.findById(jobId);
    const outputPath = path.join(__dirname, "outputs");

    let execTime = 0;
    let output = "";
    let isIncorrect = false;
    const folderPath = path.dirname(job.filepath).split(".")[0];

    if (job === undefined) {
        throw Error(`cannot find Job with id ${jobId}`);
    }
    try {
        if (job.probID != undefined) {
            const problem = await Problem.findById(mongoose.Types.ObjectId(job.probID));
            for (let i = 0; i < problem.testCases.length; i++) {
                let op = await executeCode(
                    job.filepath,
                    problem.testCases,
                    job.language,
                    problem.constraints.memLim == undefined ? DEFAULT_MEM_LIMIT : problem.constraints.memLim,
                    "TEST_CASE_CHECK"
                );

                if (op.result === problem.testCases[i].output && op.execTime <= problem.constraints.timLim) {
                    execTime += op.execTime;
                    // output += `test case ${i} PASSED\n`;//not necessary to show
                } else {
                    console.log(op.execTime, problem.constraints.timLim);
                    output += `test case ${i} FAILED\n\n`;
                    output += `your output : ${op.result}\ncorrect output : ${problem.testCases[i].output}\n`;
                    output += `\nIf the Output is correct you have not met the Time constrains, \nexecution time of your code is : ${op.execTime} ms\n\n`;
                    isIncorrect = true;
                    break;
                }
            }
            if (isIncorrect) {
                output += "Incorrect Output for one or more Test Cases\n";
            } else {
                output += "Correct Output for all Test Cases\n";
                //set flag for this problem in account wide progress array
            }
        } else {
            execOutput = await executeCode(
                job.filepath,
                job.input,
                job.language,
                DEFAULT_MEM_LIMIT,
                "NORMAL_EXECUTION"
            );
            output = execOutput.result;
            execTime = execOutput.execTime;
        }

        job["output"] = output;
        job["status"] = "success";
        job["executionTime"] = execTime;

        await job.save();

        // fs.unlinkSync(job.filepath); //delete the code file on the server
        // fs.unlinkSync(path.join(path.dirname(job.filepath), "inputFile"));
        fs.rmSync(folderPath, {recursive: true, force: true});

        if (job.language === "cpp" || job.language === "c") {
            const jobId = path.basename(job.filepath).split(".")[0];
            const executable = path.join(outputPath, `${jobId}.out`);
            // fs.unlinkSync(executable); //delete the executable file file on the server
        }

        return true;
    } catch (err) {
        // console.log(err);
        job["output"] = JSON.stringify(err);
        job["status"] = "error";
        await job.save();

        fs.rmSync(folderPath, {recursive: true, force: true});

        throw Error(JSON.stringify(err));
    }
});

jobQueue.on("failed", error => {
    console.error(error.data.id, error.failedReason);
});

const addJobToQueue = async jobId => {
    jobQueue.add({
        id: jobId,
    });
};

module.exports = {
    addJobToQueue,
};
