const {exec, spawn} = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {recursive: true});
}

const timeout = 5000;

const executeCode = (filepath, input, language, memory) => {
    return new Promise((resolve, reject) => {
        const jobId = path.basename(filepath).split(".")[0];
        const executable = path.join(outputPath, `${jobId}.out`);

        let memoryLimit = memory;
        let Data = "";

        if (input[-1] !== "\n") {
            input += "\n";
        }

        const commands = {
            cpp: [
                "ulimit",
                [
                    "-Sv",
                    `${memoryLimit};`,
                    "g++",
                    filepath,
                    "-o",
                    executable,
                    `&& cd ${outputPath} && time ./${jobId}.out`,
                ],
            ],
            py: ["ulimit", ["-Sv", `${memoryLimit};`, "time", "python3", filepath]],
            c: [
                "ulimit",
                [
                    "-Sv",
                    `${memoryLimit};`,
                    "gcc",
                    filepath,
                    "-o",
                    executable,
                    `&& cd ${outputPath} && time ./${jobId}.out`,
                ],
            ],
            java: ["ulimit", ["-Sv", `${memoryLimit};`, "time", "java", filepath]],
            js: ["ulimit", ["-Sv", `${memoryLimit};`, "time", "node", filepath]],
        };

        const childProcess = spawn(commands[language][0], commands[language][1], {
            shell: "/bin/bash",
            timeout: timeout,
            detached: true,
        });

        var KillTimer = setTimeout(() => {
            try {
                console.log("Timeout Reached, trying to kill ChildProcess");
                process.kill(-childProcess.pid, "SIGKILL");
            } catch (e) {
                console.log("Cannot kill process");
            }
        }, timeout);

        childProcess.stdin.write(`${input}`);

        childProcess.stdout.on("data", data => {
            // console.log("in stdout");
            // console.log(`${data}`);
            Data += data;
        });

        childProcess.stderr.on("data", data => {
            // console.log("in stderr");
            // console.log(`${data}`);
            Data += data.toString();
        });

        childProcess.on("exit", () => {
            console.log("Exited Process, KillTimer cleared");
            clearTimeout(KillTimer);
        });

        childProcess.on("close", data => {
            console.log("Process Closed with code" + ": " + `${data}`);
            console.log(Data);
            if (data === 0) {
                let timeregex = /real\s*(\d+)m(\d+.\d\d\d)s/gm;
                const time = timeregex.exec(Data);
                const execTime = (time[1] * 60 + time[2]) * 1000;
                Data = Data.replaceAll(/\nreal\s*\dm\d.\d\d\ds\nuser\s*\dm\d.\d\d\ds\nsys\s*\dm\d.\d\d\ds\n/gm, "");
                const DataObj = {result: Data, execTime: execTime};
                resolve(DataObj);
            } else {
                Data = Data.replaceAll(/\nreal\s*\dm\d.\d\d\ds\nuser\s*\dm\d.\d\d\ds\nsys\s*\dm\d.\d\d\ds\n/gm, "");
                reject(Data.replaceAll(filepath, "In Your Code"));
            }
        });
    });
};

module.exports = {
    executeCode,
};
