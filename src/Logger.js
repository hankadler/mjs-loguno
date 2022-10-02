import os from "os";
import { v1 } from "uuid";
import { OUTLET_CONFIG, FILE_TYPES, LEVELS, TEMPLATES } from "./constants";
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
 * Logs information to ``outlets``.
 *
 * @property {Level[]} LEVELS - Logging levels.
 * @property {Template[]} TEMPLATES - Output formats.
 * @property {OutletConfig} defaults - Options to apply to new outlets when added.
 * @property {Outlet[]} outlets - Output streams.
 */
class Logger {
  static LEVELS = { ...LEVELS }

  static TEMPLATES = { ...TEMPLATES }

  static defaults = { ...OUTLET_CONFIG }

  /**
   * @typedef Outlet
   * @property {string} id - The outlet id.
   * @property {string} name - The outlet name.
   * @property {string | NodeJS.WriteStream} file - A file name or stream object.
   * @mixes {OutletConfig}
   */
  static outlets = [
    {
      _dateStart: new Date(),
      _frame: getFrame(1),
      id: v1(),
      name: "root",
      file: process.stdout,
      ...OUTLET_CONFIG,
      isExclusive: false,
    }
  ];

  /**
   * Searches ``Logger.outlets`` for ``outlet`` with given ``id`` and returns it.
   *
   * @param {string} id - The outlet id.
   * @returns {Outlet|any}
   */
  static findOutletById = (id) => this.outlets.filter((outlet) => outlet.id === id)[0]

  /**
   * Adds outlet with given config.
   *
   * @param {WriteStream|string} file - Outlet stream or filename.
   * @param {OutletConfig=} config
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
   * @param {Object} options - Additional options.
   * @param {boolean} options.headless - Send message only without additional information?
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
    _frame = getFrame(3),
    name = _frame.module || "root",
    isExclusive = OUTLET_CONFIG.isExclusive,
    threshold = OUTLET_CONFIG.threshold,
    template = OUTLET_CONFIG.template,
    colors = OUTLET_CONFIG.colors
  } = {}) {
    // return existing outlet.id if outlet.name was already added
    const outletFound = this.outlets.find((outlet) => outlet.file === file);
    if (outletFound) return outletFound.id;

    // validate file type
    if (!FILE_TYPES.includes(file.constructor.name)) {
      throw new TypeError(`Bad outlet file type! Valid types: ${JSON.stringify(FILE_TYPES)}`);
    }

    const outlet = {
      _dateStart: new Date(),
      _frame,
      id: v1(),
      name,
      file,
      isExclusive,
      threshold,
      template,
      colors
    };

    // init file ?
    if (typeof file === "string") {
      const text = (
        `DATE: ${formatDate(outlet._dateStart)}\n`
        + `  OS: ${os.type()} ${os.release()}\n`
        + `USER: ${os.userInfo().username}\n`
        + ` DIR: ${process.cwd()}\n`
        + ` SRC: ${_frame.file}\n\n`
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
   * @param {string} _caller - Becomes `name` in message. // Do not remove from signature!
   */
  static #log(level, message, headless = false, _caller = getFrame(3).module) {
    const outlets = this.outlets.filter((outlet) => level >= outlet.threshold);

    if (!outlets.length) return;

    outlets.forEach(({ _frame, file, _dateStart, name, template, colors, isExclusive }) => {
      const duration = getDuration(_dateStart, new Date());
      const isFile = typeof file === "string";
      if (isExclusive && _frame.module !== _caller) return null;
      const fields = { duration, level, name: _caller || name, message };
      if (headless) return appendText(file, message);
      const text = formatText(template, fields, colors, isFile);
      return appendText(file, text);
    });
  }
}

export default Logger;
