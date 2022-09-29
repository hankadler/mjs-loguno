import Logger from "../src";

Logger.logDebug("This wouldn't show up if NODE_ENV was set to 'production'.");
Logger.logInfo("Neither would this.");
Logger.logInfo("You can see this because Logger has one outlet by default; stdout.");
Logger.logInfo("Let's log to a file as well...");
Logger.logWarn("The file will be created in the current dir, unless an absolute path is given!");
Logger.addOutlet("basic.log", {
  threshold: Logger.LEVELS.TRACE, // so basic.log accepts all messages, regardless of NODE_ENV
  template: Logger.TEMPLATES.dlnm // -> {duration} {level} {name}: {message}
});
Logger.logInfo("This shows up in console AND basic.log.");
Logger.logInfo("Simply designed: one logger (uno), just add as many outlets as you need.");
