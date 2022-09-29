import Logger from "../../src";

const funcB = async () => {
  Logger.addOutlet("module-b.log", {
    threshold: Logger.LEVELS.INFO,
    template: Logger.TEMPLATES.lnm,
  });

  Logger.logDebug("This should not show up on module-b.log!");
  Logger.logError("This is an error! Also attempts to log a trace by default.");
};

export default funcB;
