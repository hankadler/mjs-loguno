import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const srcDir = dirname(fileURLToPath(import.meta.url));
const testDir = resolve(`${srcDir}/../test`);

export { srcDir, testDir };
