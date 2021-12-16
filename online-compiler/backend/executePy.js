const { exec } = require("child_process");

const executePy = (filepath) => {
  // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
  return new Promise((resolve, reject) => {
    exec(
      `python ${filepath}`,
      // { shell: shellpath },
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
