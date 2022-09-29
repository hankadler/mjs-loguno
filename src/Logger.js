import os from "os";
import { v1 } from "uuid";
import { DEFAULTS, FILE_TYPES, LEVELS, TEMPLATES } from "./constants";
import {
  appendText,
  formatDate,
  formatText,
  getDuration,
  getFrame,
  getStack,
  initFile
} from "./utils";
import formatTrace from "./utils/formatTrace";

/**
 * Logs information to outlets.
 *
 * @property {Object} defaults - The options to apply to new outlets when added.
 * @property {Object} Levels - The available logging levels.
 * @property {Array<Object>} outlets - The output streams the Logger can write to.
 */
class Logger {
  static defaults = { ...DEFAULTS }

  static LEVELS = LEVELS

  static TEMPLATES = TEMPLATES

  static outlets = [
    {
      id: v1(),
      file: process.stdout,
      dateStart: new Date(),
      threshold: DEFAULTS.threshold,
      frame: getFrame(1),
      name: "root",
      template: DEFAULTS.template,
      colors: DEFAULTS.colors,
      isExclusive: false
    }
  ]

  static findOutletById = (id) => this.outlets.filter((outlet) => outlet.id === id)[0]

  /**
   * Adds outlet with given config.
   *
   * @param {WriteStream|string} file - Outlet stream or filename.
   * @param {Object=} config
   * @param {number|string=} config.threshold - Level message must exceed to show up.
   * @param {string=} config.name - The outlet name; caller `moduleName` by default.
   * @param {string=} config.template - The format template.
   * @param {Object=} config.colors - The color options.
   * @param {boolean=} config.isExclusive - Log only from outlet originator? Default=true
   * @returns {string} The outlet.id
   * @throws {TypeError} if file type is invalid.
   */
  static addOutlet(file, config = {}) {
    return this.#addOutlet(file, config);
  }

  /**
   * Removes outlet.
   *
   * @param {string} id - The outlet id.
   */
  static removeOutlet(id) {
    this.outlets = this.outlets.filter(({ id: _id }) => _id !== id);
  }

  /**
   * Removes all outlets.
   *
   * @param {boolean} ignoreRoot - Ignore "root" logger? Default=false
   */
  static removeAllOutlets(ignoreRoot = false) {
    this.outlets = ignoreRoot ? this.outlets.filter(({ name }) => name === "root") : [];
  }

  /**
   * Sends a TRACE message to outlets.
   *
   * Should be used alongside ERROR or FATAL messages.
   *
   * @param {string=} prefix - Optional prefix to message.
   * @param {boolean} headless - Send message only without additional information?
   */
  static logTrace(prefix = "", { headless = false } = {}) {
    const message = `${prefix}${headless ? "" : "\n"}${formatTrace(getStack())}\n`;
    this.#log(LEVELS.TRACE, message, headless);
  }

  /**
   * Sends a DEBUG message to outlets.
   *
   * @param {string} message
   */
  static logDebug(message) {
    this.#log(LEVELS.DEBUG, message);
  }

  /**
   * Sends a DEBUG message to outlets.
   *
   * @param {string} message
   */
  static logInfo(message) {
    this.#log(LEVELS.INFO, message);
  }

  /**
   * Sends a WARN message to outlets.
   *
   * @param {string} message
   */
  static logWarn(message) {
    this.#log(LEVELS.WARN, message);
  }

  /**
   * Sends an ERROR message to outlets.
   *
   * @param {string} message
   */
  static logError(message) {
    this.#log(LEVELS.ERROR, message);
    this.logTrace("", { headless: true });
  }

  /**
   * Sends a FATAL message to outlets and triggers `process.exit(1)`.
   *
   * @param {string} message
   */
  static logFatal(message) {
    this.#log(LEVELS.FATAL, message);
    this.logTrace("", { headless: true });
    process.exit(1);
  }

  static #addOutlet(file, {
    frame = getFrame(3),
    threshold = DEFAULTS.threshold,
    name = frame.module || "root",
    template = DEFAULTS.template,
    colors = DEFAULTS.colors,
    isExclusive = DEFAULTS.isExclusive
  } = {}) {
    // return existing outlet.id if outlet.name was already added
    const outletFound = this.outlets.find((outlet) => outlet.file === file);
    if (outletFound) return outletFound.id;

    // validate file type
    if (!FILE_TYPES.includes(file.constructor.name)) {
      throw new TypeError(`Bad outlet file type! Valid types: ${JSON.stringify(FILE_TYPES)}`);
    }

    const outlet = {
      id: v1(),
      dateStart: new Date(),
      frame,
      file,
      threshold,
      name,
      template,
      colors,
      isExclusive
    };

    // init file ?
    if (typeof file === "string") {
      const text = (
        `DATE: ${formatDate(outlet.dateStart)}\n`
        + `  OS: ${os.type()} ${os.release()}\n`
        + `USER: ${os.userInfo().username}\n`
        + ` DIR: ${process.cwd()}\n`
        + ` SRC: ${frame.file}\n\n`
      );
      initFile(file, text);
    }

    // add outlet
    this.outlets.push(outlet);

    return outlet.id;
  }

  /*
   * Logs information if level >= outlet threshold.
   *
   * @param {number} level - The message level.
   * @param {string} message - The message.
   * @param {boolean} headless - Send bare message?
   * @param {string} caller - Becomes `name` in message. // Do not remove from signature!
   */
  static #log(level, message, headless = false, caller = getFrame(3).module) {
    const outlets = this.outlets.filter((outlet) => level >= outlet.threshold);

    if (!outlets.length) return;

    outlets.forEach(({ frame, file, dateStart, name, template, colors, isExclusive }) => {
      const duration = getDuration(dateStart, new Date());
      const isFile = typeof file === "string";
      if (isExclusive && frame.module !== caller) return null;
      const fields = { duration, level, name: caller || name, message };
      if (headless) return appendText(file, message);
      const text = formatText(template, fields, colors, isFile);
      return appendText(file, text);
    });
  }
}

export default Logger;
