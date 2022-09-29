import Logger from "../src";

Logger.outlets[0].threshold = Logger.LEVELS.DEBUG; // So console shows DEBUG messages on any env

Logger.logInfo("Default config is optimized for visibility on both dark and light consoles.");
Logger.logWarn("But if use light themes...");

Logger.logDebug("Turn 'inverted' -> OFF");
Logger.outlets[0].colors.inverted = false;
Logger.logDebug("-".repeat(80));

Logger.logInfo("Looks better on light background, right?");
Logger.logWarn("Color switches include 'mono', 'inverted, 'bg.enabled' and 'fg.enabled'.");

Logger.logWarn("Let's play with some of the options. Are you ready?");

Logger.logDebug("Turn 'inverted' -> OFF and 'mono' -> ON");
Logger.outlets[0].colors.inverted = true;
Logger.outlets[0].colors.mono = true;
Logger.logDebug("-".repeat(80));

Logger.logDebug("Colors all of this.");
Logger.logInfo("And this.");
Logger.logWarn("You get the idea.");
Logger.logError("It can be overwhelming, so it's off by default.");

Logger.logInfo("Some might prefer turning 'bg.enabled' -> OFF");
Logger.outlets[0].colors.bg.enabled = false;
Logger.logDebug("-".repeat(80));

Logger.logInfo("Looks great on dark consoles, but is not always visible on light ones...");
Logger.logDebug("Three");
Logger.logInfo("Two");
Logger.logWarn("One");
Logger.logError("Taste the rainbow!");

Logger.outlets[0].colors.mono = false;
Logger.logDebug("-".repeat(80));

Logger.logInfo("Now back to defaults... 'mono' -> OFF & 'bg.enabled' -> ON");
Logger.outlets[0].colors.bg.enabled = true;
Logger.logDebug("-".repeat(80));

Logger.logInfo("A TRACE message"); // will not show up unless you change the root outlet threshold
Logger.logDebug("A DEBUG message.");
Logger.logInfo("An INFO message.");
Logger.logWarn("A WARN message!");
Logger.logError("A ERROR message!");
Logger.logFatal("A FATAL message! Terminates the process... Good bye!");
