const fs = require("fs");
const path = require("path");
const Queue = require("bull");
const outputs = path.join(__dirname, "outputs");

const Job = require("./models/Job");
const { executeCode } = require("./executeCode");

const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  // console.log(job.input);
  try {
    let output;
    job["startedAt"] = new Date();

    output = await executeCode(job.filepath, job.input, job.language);

    job["completedAt"] = new Date();
    job["output"] = output;
    job["status"] = "success";

    await job.save();

    fs.unlinkSync(job.filepath); //delete the code file on the server

    return true;
  } catch (err) {
    job["completedAt"] = new Date();
    job["output"] = JSON.stringify(err);
    job["status"] = "error";
    await job.save();
    throw Error(JSON.stringify(err));
  }
});

jobQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});

const addJobToQueue = async (jobId) => {
  jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};
