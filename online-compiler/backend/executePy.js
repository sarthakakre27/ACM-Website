const { exec, spawn } = require("child_process");
// const { resolve } = require("path");
// const { stdout } = require("process");

const executePy = (filepath, input) => {
  if(input[-1] !== "\n")
    input+="\n";
  // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
  return new Promise((resolve, reject) => {
    let Data = "";
    const py = spawn("python", [filepath], { shell: true });

    py.stdin.write(`${input}`);

    py.stdout.on('data', (data) => {
      // console.log("in stdout");
      // console.log(`${data}`);
      Data += data;
      // resolve(data);
    });

    py.stderr.on('data', (data) => {
      // console.log("in stderr");
      // console.log(data.toString());
      reject(data.toString());
    });

    py.on('close', (data) => {
      if (data !== 0) {
        // console.log(`grep process exited with code ${code}`);
        reject(data.toString());
      }
      resolve(Data);
    });
    // resolve("abc");
  });
};

// const executePy = (filepath, input) => {
//   // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
//   return new Promise((resolve, reject) => {
//     exec(
//       `python ${filepath}`,
//       // { shell: shellpath },
//       (error, stdout, stderr) => {
//         error && reject({ error, stderr });
//         stderr && reject(stderr);
//         resolve(stdout);
//       }
//     );
//   });
// };

module.exports = {
  executePy,
};
