/**
 * @typedef Template - Logger output formats.
 * @property {string} m - The ``{message}`` format
 * @property {string} lm - The ``{level}: {message}`` format
 * @property {string} lnm - The ``{level} {name}: {message}`` format
 * @property {string} dlm - The ``{duration} {level}: {message}`` format
 * @property {string} dlnm - The ``{duration} {level} {name}: {message}`` format
 */

/**
 * @type {Template}
 */
const TEMPLATES = {
  m: "{message}",
  lm: "{level}: {message}",
  lnm: "{level} {name}: {message}",
  dlm: "{duration} {level}: {message}",
  dlnm: "{duration} {level} {name}: {message}"
};

export default TEMPLATES;
