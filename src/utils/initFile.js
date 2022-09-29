import fs from "fs";

const initFile = (file, text, encoding = "utf8") => {
  fs.writeFileSync(file, text, encoding);
};

export default initFile;
