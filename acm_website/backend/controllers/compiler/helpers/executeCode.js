const {exec, spawn} = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const timeout = 10000;

const executeCode = (filepath, input, language, memory, purpose) => {
    const outputPath = path.dirname(filepath).split(".")[0];
    const jobId = path.basename(filepath).split(".")[0];
    const dirUsercode = path.join(path.resolve(__dirname, "../../../"), `temp/${jobId}`);
    let memoryLimit = memory;
    let Data = "";

    // console.log(input);
    const inputFileMaker = async (dirUsercode, input, name) => {
        await exec(`echo "${input}" >> ${dirUsercode}/${name}`);
    };

    if (purpose == "NORMAL_EXECUTION") {
        console.log("Normal Running");
        return new Promise((resolve, reject) => {
            inputFileMaker(dirUsercode, input, "inputFile");

            if (input[-1] !== "\n") {
                input += "\n";
            }

            let commands = {
                cpp: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ulimit -Sv ${memoryLimit} && g++ ${jobId}.cpp -o /code/a.out && time ./a.out -< $"/code/inputFile"'`,
                ],
                py: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ulimit -Sv ${memoryLimit} &&  time  python3 -u ${jobId}.py -< $"/code/inputFile"'`,
                ],
                c: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ulimit -Sv ${memoryLimit} && gcc ${jobId}.c -o /code/a.out && time ./a.out -< $"/code/inputFile"'`,
                ],
                java: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ulimit -Sv ${memoryLimit} &&  time  java ${jobId}.java -< $"/code/inputFile"'`,
                ],
                js: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ulimit -Sv ${memoryLimit} &&  time  node ${jobId}.js -< $"/code/inputFile"'`,
                ],
            };

            const dockerScriptPath = path.join(__dirname, "./dockerRun.sh");

            const childProcess = spawn(dockerScriptPath, commands[language], {
                shell: "/bin/bash",
                timeout: timeout,
                detached: true,
            });

            // childProcess.stdin.write(`${input}`);

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
    } else if (purpose == "TEST_CASE_CHECK") {
        return new Promise((resolve, reject) => {
            console.log("Work Started");
            let counter = 0;

            input.forEach((element, key) => {
                const particularInput = element.input;
                inputFileMaker(dirUsercode, particularInput, `inputFile${key}`);
                counter = key;
            });

            const commands = {
                testCaseCheck: [
                    `"${outputPath}":/code compiler_image /bin/bash -c 'cd /code && ./CodeRunner.sh ${counter} ${language} ${memoryLimit}'`,
                ],
            };

            const dockerScriptPath = path.join(__dirname, "./dockerRun.sh");

            exec(
                "cd " +
                    path.resolve(outputPath, "../../controllers/compiler/helpers") +
                    `&& chmod +x CodeRunner.sh` +
                    `&& cp CodeRunner.sh ${outputPath}/CodeRunner.sh`
            );
            const childProcess = spawn(dockerScriptPath, commands["testCaseCheck"], {
                shell: "/bin/bash",
                timeout: timeout,
                detached: true,
            });

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
                    let jsonObj = JSON.parse("{" + Data.trim().slice(0, -1) + "}");
                    const results = [];
                    const execTimes = [];

                    Object.keys(jsonObj).forEach(key => {
                        const testCase = jsonObj[key];
                        let timeregex = /\s*Time52442cd9:(\d\.\d+)/gm;
                        const time = timeregex.exec(testCase);
                        const replaced = testCase
                            .replace(/[\\r]*\\n/g, "\n")
                            .replaceAll(/\s*Time52442cd9:\d\.\d+/gm, "");
                        const execTime = time[1] * 1000;
                        results.push(replaced);
                        execTimes.push(execTime);
                        // jsonObj[key] = [replaced, execTime];
                    });

                    const DataObj = {result: results, execTime: execTimes};
                    resolve(DataObj);
                } else {
                    Data = Data.replaceAll(/\s*Time52442cd9:\d\.\d+/gm, "");
                    reject(Data.replaceAll(filepath, "In Your Code"));
                }
            });
        });
    }
};

module.exports = {
    executeCode,
};
