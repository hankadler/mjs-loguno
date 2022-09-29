import Logger from "../../src";
import funcA from "./moduleA";

Logger.outlets[0].threshold = Logger.LEVELS.TRACE;

Logger.addOutlet("app.log", {
  isExclusive: false, // so it receives messages originating from modules other than this
  threshold: Logger.LEVELS.TRACE,
  template: Logger.TEMPLATES.dlnm
});

Logger.logInfo("This shows up in console & 'app.log'.");

funcA().catch((error) => Logger.logError(error.message));
