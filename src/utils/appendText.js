import fs from "fs";

/**
 * Appends text to file.
 *
 * @param {WriteStream|string} file - The file.
 * @param {string} text - The text.
 */
const appendText = (file, text) => {
  if (file.constructor.name === "WriteStream") {
    file.write(`${text}\n`);
  } else {
    fs.appendFileSync(file, `${text}\n`);
  }
};

export default appendText;
