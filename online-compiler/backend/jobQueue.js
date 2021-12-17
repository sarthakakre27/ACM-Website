const fs = require("fs");
const path = require("path");
const Queue = require("bull");
const outputs = path.join(__dirname, "outputs");

const Job = require("./models/Job");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJs } = require("./executeJs");
const { executeC } = require("./executeC");
const { executeJava } = require("./executeJava");

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
    console.log("before exec");
    if (job.language === "cpp") {
      output = await executeCpp(job.filepath, job.input);
      console.log("cpp exec");
    } else if (job.language === "py") {
      output = await executePy(job.filepath, job.input);
    } else if (job.language === "c") {
      output = await executeC(job.filepath);
    } else if(job.language === "js") {
      output = await executeJs(job.filepath);
    } else if (job.language === "java") {
      output = await executeJava(job.filepath);
    }
    job["completedAt"] = new Date();
    job["output"] = output;
    console.log("before success is hard work");
    job["status"] = "success";
    console.log(job);
    await job.save();
    // console.log(path.basename(job.filepath));
    console.log(job.filepath);
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
