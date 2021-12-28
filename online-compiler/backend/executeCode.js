const {exec, spawn} = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const timeout = 10000;

const executeCode = (filepath, input, language, memory) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.dirname(filepath).split(".")[0];
        const jobId = path.basename(filepath).split(".")[0];
        const executable = path.join(outputPath, `${jobId}.out`);

        let memoryLimit = memory;
        let Data = "";

        if (input[-1] !== "\n") {
            input += "\n";
        }

        const commands = {
            // cpp: [
            //     "ulimit",
            //     [
            //         "-Sv",
            //         `${memoryLimit};`,
            //         "g++",
            //         filepath,
            //         "-o",
            //         executable,
            //         `&& cd ${outputPath} && time ./${jobId}.out`,
            //     ],
            // ],
            cpp: [
                `"${outputPath}":/code  --memory="70m"  compiler_image /bin/bash -c 'cd /code && ulimit -Sv 100000 && g++ ${jobId}.cpp -o /code/a.out && time ./a.out -< $"/code/inputFile"'`,
            ],
            py: [
                `"${outputPath}":/code  --memory="70m"  compiler_image /bin/bash -c 'cd /code && ulimit -Sv 100000 &&  time  python3 -u ${jobId}.py -< $"/code/inputFile"'`,
            ],
            // c: [
            //     "ulimit",
            //     [
            //         "-Sv",
            //         `${memoryLimit};`,
            //         "gcc",
            //         filepath,
            //         "-o",
            //         executable,
            //         `&& cd ${outputPath} && time ./${jobId}.out`,
            //     ],
            // ],
            // java: ["ulimit", ["-Sv", `${memoryLimit};`, "time", "java", filepath]],
            // js: ["ulimit", ["-Sv", `${memoryLimit};`, "time", "node", filepath]],
        };

        const childProcess = spawn("./dockerRun.sh", commands[language], {
            shell: "/bin/bash",
            timeout: timeout,
            detached: true,
        });

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

        childProcess.on("close", data => {
            console.log("Process Closed with code" + ": " + `${data}`);
            // console.log(Data);
            if (data === 0) {
                let timeregex = /real\s*(\d+)m(\d+.\d\d\d)s/gm;
                const time = timeregex.exec(Data);
                const execTime = (time[1] * 60 + time[2]) * 1000;
                Data = Data.replaceAll(
                    /\s*real\s*\dm\d\.\d\d\ds\s*user\s*\dm\d\.\d\d\ds\s*sys\s*\dm\d\.\d\d\ds\s*/gm,
                    ""
                );
                const DataObj = {result: Data, execTime: execTime};
                // console.log(DataObj);
                resolve(DataObj);
            } else {
                Data = Data.replaceAll(
                    /\s*real\s*\dm\d\.\d\d\ds\s*user\s*\dm\d\.\d\d\ds\s*sys\s*\dm\d\.\d\d\ds\s*/gm,
                    ""
                );
                reject(Data.replaceAll(filepath, "In Your Code"));
            }
        });
    });
};

module.exports = {
    executeCode,
};
