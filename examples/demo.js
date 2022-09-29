import Logger from "../src"; // Logger has one outlet by default; stdout

Logger.logTrace("Shows intuitive stacktrace.");
Logger.logDebug("Standard six logging levels included: TRACE, DEBUG, INFO, WARN, ERROR, FATAL");
Logger.logInfo("Logger has one important property: `outlets`, an array of output config objects.");
Logger.logWarn("`Logger.outlets[0].threshold` is determined by `NODE_ENV`.");
Logger.logInfo("Thus TRACE, DEBUG & INFO are only visible if process.NODE_ENV != 'production'.");

// let's hide TRACE, DEBUG and INFO from stdout...
Logger.outlets[0].threshold = Logger.LEVELS.WARN;

// and let's add another all-inclusive outlet pointing to file 'demo.log'
Logger.addOutlet("demo.log", {
  isExclusive: false, // so it receives messages originating from modules other than this one
  threshold: Logger.LEVELS.TRACE, // so it shows all messages
  template: Logger.TEMPLATES.dlnm // so format -> {duration} {level} {name} : {message}
});

Logger.logError(
  "Logs to both stdout and 'demo.log', but given threshold settings, only 'demo.log' shows trace."
);

Logger.logFatal("Highest level message. Terminates the process.");
