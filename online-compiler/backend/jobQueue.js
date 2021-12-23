const fs = require("fs");
const path = require("path");
const Queue = require("bull");
const mongoose = require("mongoose");
const outputs = path.join(__dirname, "outputs");

const Job = require("./models/Job");
const Problem = require("./models/Problem");
const { executeCode } = require("./executeCode");
const { Mongoose } = require("mongoose");

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
    let isIncorrect = false;
    job["startedAt"] = new Date();

    if(job.probID != -1)
    {
      output = "";
      try{
        const problem = await Problem.findById( mongoose.Types.ObjectId(job.probID) );
        // console.log(problem.testCases.length);
        for(let i = 0; i < problem.testCases.length; i++)
        {
          // console.log(testCase.input);

          //time check
          
          let op = await executeCode(job.filepath, problem.testCases[i].input, job.language);

          if(op === problem.testCases[i].output){
            // output += `test case ${i} PASSED\n`;//not necessary to show
          } else {
            output += `test case ${i} FAILED\n`;
            output += `your output :\n${op}\ncorrect output: \n${problem.testCases[i].output}\n`;
            isIncorrect = true;
            break;
          }
          //delete executable
        }
        if(isIncorrect){
          output += "Incorrect Output for one or more Test Cases\n";
        }
        else{
          output += "Correct Output for all Test Cases\n";
          //set flag for this problem in account wide progress array
        }
      } catch(e)
      {
        console.log("no problem(coding problem) found");
        console.log(e);
      }
    }
    else{ // normal execution
      output = await executeCode(job.filepath, job.input, job.language);
    }

    
    // console.log(`in jobQ - ${output}`);


    job["completedAt"] = new Date();
    console.log(output);
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
