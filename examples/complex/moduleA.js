import Logger from "../../src";
import funcB from "./moduleB";

const funcA = async () => {
  Logger.outlets[0].threshold = Logger.LEVELS.TRACE;

  Logger.addOutlet("module-a.log", {
    threshold: Logger.LEVELS.INFO,
    template: Logger.TEMPLATES.lnm,
  });

  Logger.logDebug("--- moduleA.funcA ---");

  await funcB();

  Logger.logWarn("This should not show up on module-b.log!");
};

export default funcA;
