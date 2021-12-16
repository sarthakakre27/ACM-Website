const { exec } = require("child_process");

const executeJs = (filepath) => {
  // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
  return new Promise((resolve, reject) => {
    exec(
      `node ${filepath}`,
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
  executeJs,
};
