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
    const timeout = 1000;
    let isDetached = true;

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
      isDetached = false;
    } else {
      commands = { ...commandsLinux };
    }

    const childProcess = spawn(commands[language][0], commands[language][1], {
      shell: true,
      timeout: timeout,
      // detached: false,
    });
    console.log(childProcess.pid);

    var KillTimer = setTimeout(() => {
      try {
        console.log("Timeout Reached, trying to kill ChildProcess");
        process.kill(-childProcess.pid, "SIGKILL");
        // spawn("taskkill", ["/pid", childProcess.pid, '/f', '/t']);
        // console.log(childProcess.pid);
        // spawn("taskkill", ["/F","/PID",childProcess.pid]);
        // childProcess.kill();
      } catch (e) {
        console.log("Cannot kill process");
      }
    }, timeout);

    childProcess.stdin.write(`${input}`);

    childProcess.stdout.on("data", (data) => {
        // console.log("in stdout");
        // console.log(`${data}`);
        Data += data;
    });

    childProcess.stderr.on("data", (data) => {
      reject(data.toString().replaceAll(filepath, "In Your Code"));
    });

    childProcess.on("exit", () => {
      console.log("Exited Process, KillTimer cleared");
      clearTimeout(KillTimer);
    });

    childProcess.on("close", (data) => {
      console.log("Process Closed with code" + ": " + `${data}`);
      resolve(Data);
    });
  });
};

module.exports = {
  executeCode,
};
