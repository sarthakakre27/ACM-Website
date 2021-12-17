const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  if(input[-1] !== "\n")
    input+="\n";
  // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
  return new Promise((resolve, reject) => {
    let Data = "";
    console.log(`${filepath} ${outPath}`);
    const py = spawn("g++", [filepath,"-o",outPath], { shell: true });

    // py.stdin.write(`${input}`);

    py.stdout.on('data', (data) => {
      console.log("in stdoutttttttttttttt");
      console.log(`${data}`);
      Data += data;
      // resolve(data);
    });

    py.stderr.on('data', (data) => {
      console.log("in stderrrrrrrrrrrrr");
      console.log(data.toString());
      reject(data.toString());
    });

    py.on('close', (data) => {
      if (data !== 0) {
        // console.log(`grep process exited with code ${code}`);
        reject(data.toString());
      }
      console.log("------------");
      console.log(outputPath);
      let ex = spawn(`${jobId}.out`,{ shell: true, cwd: outputPath });
      console.log("spawned");

      ex.stdin.write(`${input}`);
      
      ex.stdout.on('data', (data) => {
        console.log("in stdout");
        console.log(`${data}`);
        Data += data;
        // resolve(data);
      });
  
      ex.stderr.on('data', (data) => {
        console.log("in stderr");
        console.log(data.toString());
        reject(data.toString());
      });

      ex.on("close", (data) => {
        console.log("in close");
        resolve(Data);
      })
      // resolve(Data);
    });
    // resolve("abc");
  });
};


// const executeCpp = (filepath, input) => {
//   const jobId = path.basename(filepath).split(".")[0];
//   const outPath = path.join(outputPath, `${jobId}.out`);
//   // console.log(input);

//   return new Promise((resolve, reject) => {
//     exec(
//       `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${input} > ${jobId}.out`,
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
  executeCpp,
};
