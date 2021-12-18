const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (filepath, input, language) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filepath).split(".")[0];
    const executable = path.join(outputPath, `${jobId}.out`);

    var commands = {};
    let Data = "";
    const timeout = 2000;

    if (input[-1] !== "\n") {
      input += "\n";
    }

    const commandsLinux = {
      cpp: [
        "g++",
        [filepath, "-o", executable, `&& cd ${outputPath} && ./${jobId}.out`],
      ],
      py: ["python3", [filepath]],
      c: [
        "gcc",
        [filepath, "-o", executable, `&& cd ${outputPath} && ./${jobId}.out`],
      ],
      java: ["java", [filepath]],
      js: ["node", [filepath]],
    };

    const commandsWindows = {
      cpp: [
        "g++",
        [filepath, "-o", executable, `&& cd ${outputPath} && ${jobId}.out`],
      ],
      py: ["python", [filepath]],
      c: [
        "gcc",
        [filepath, "-o", executable, `&& cd ${outputPath} && ${jobId}.out`],
      ],
      java: ["java", [filepath]],
      js: ["node", [filepath]],
    };

    if (os.platform() === "win32") {
      commands = { ...commandsWindows };
    } else {
      commands = { ...commandsLinux };
    }

    const childProcess = spawn(commands[language][0], commands[language][1], {
      shell: true,
      timeout: timeout,
    });

    childProcess.stdin.write(`${input}`);

    childProcess.stdout.on("data", (data) => {
      //   console.log("in stdout");
      console.log(`${data}`);
      Data += data;
    });

    childProcess.stderr.on("data", (data) => {
      console.log("in stderr");
      console.log(data.toString());
      reject(data.toString());
    });

    childProcess.on("close", (data) => {
      console.log("in close" + "," + `${data}`);
      resolve(Data);
    });
  });
};

module.exports = {
  executeCode,
};
