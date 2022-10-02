/**
 * @typedef {{
 *   TRACE: number,
 *   ERROR: number,
 *   INFO: number,
 *   DEBUG: number,
 *   FATAL: number,
 *   WARN: number
 * }} Level - Enum of logging levels.
 */

/**
 * @enum {Level}
 */
const LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

export default LEVELS;
