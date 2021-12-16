const { exec } = require("child_process");

const executeJava = (filepath) => {
  // let shellpath = `C:\\Program Files\\Git\\git-bash.exe`;
  return new Promise((resolve, reject) => {
    exec(
      `java ${filepath}`,
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
  executeJava,
};