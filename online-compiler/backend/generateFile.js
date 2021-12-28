const fs = require("fs");
const path = require("path");
const {v4: uuid} = require("uuid");

// const dirCodes = path.join(__dirname, "codes");

// if (!fs.existsSync(dirCodes)) {
//   fs.mkdirSync(dirCodes, { recursive: true });
// }

const generateFile = async (format, content, input) => {
    const jobId = uuid().toString().substring(0, 8);

    const dirUsercode = path.join(__dirname, `temp/${jobId}`);
    fs.mkdirSync(dirUsercode, {recursive: true});

    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirUsercode, filename);

    await fs.writeFileSync(filepath, content);
    await fs.writeFileSync(path.join(dirUsercode, "inputFile"), input);

    return {filepath: filepath};
};

module.exports = {
    generateFile,
};
