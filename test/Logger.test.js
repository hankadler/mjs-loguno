import assert from "assert";
import fs from "fs";
import inquirer from "inquirer";
import { testDir } from "../src/config";
import Logger from "../src";

let testIndex = 0;

const getLogFileName = (n) => `${testDir}/var/Logger.test-${n}.log`;

const deleteLogFile = (path) => {
  try {
    fs.accessSync(path);
  } catch {
    return;
  }
  fs.unlinkSync(path);
  console.log(`Deleted '${path}'`);
};

const onUncaught = (error) => {
  console.log(error.message);
  process.exit(1);
};

process.on("unhandledRejection", onUncaught);

describe("Logger", () => {
  beforeEach(() => {
    Logger.removeAllOutlets();
  });

  afterEach(() => {
    testIndex += 1;
  });

  after(async () => {
    const { proceed } = await inquirer.prompt({
      type: "rawlist",
      name: "proceed",
      choices: ["yes", "no"],
      message: ["\nDelete log files (Y/n)? "]
    });

    if (proceed === "yes") {
      console.log("");
      await Promise.all([...Array(testIndex).keys()].map((n) => deleteLogFile(getLogFileName(n))));
    }
  });

  describe("New outlet", () => {
    Logger.removeAllOutlets();
    const { isExclusive } = Logger.defaults;
    const outletId = Logger.addOutlet(getLogFileName(testIndex));
    const outlet = Logger.findOutletById(outletId);
    it("receives defaults", () => assert.equal(isExclusive, outlet.isExclusive));
  });

  describe("Adding duplicate outlet", () => {
    Logger.removeAllOutlets();
    const outletIdOne = Logger.addOutlet(getLogFileName(testIndex));
    Logger.logWarn("This message should appear in log file!");
    const outletIdTwo = Logger.addOutlet(getLogFileName(testIndex));
    it("does nothing", () => assert.equal(outletIdOne, outletIdTwo));
  });

  describe("Logging threshold", () => {
    Logger.removeAllOutlets();
    const fileName = getLogFileName(testIndex);
    Logger.addOutlet(fileName, { threshold: Logger.LEVELS.WARN });
    const c0 = fs.readFileSync(fileName, "utf-8").split("\n").length; // initial line count
    const expectedLineCounts = [c0, c0, c0 + 1];
    const actualLineCounts = [];
    Logger.logTrace("Ping!");
    actualLineCounts.push(fs.readFileSync(fileName, "utf-8").split("\n").length);
    Logger.logInfo("Ping!");
    actualLineCounts.push(fs.readFileSync(fileName, "utf-8").split("\n").length);
    Logger.logWarn("Ping!");
    actualLineCounts.push(fs.readFileSync(fileName, "utf-8").split("\n").length);
    it("works", () => assert.equal(actualLineCounts.toString(), expectedLineCounts.toString()));
  });

  // isExclusive works
});
