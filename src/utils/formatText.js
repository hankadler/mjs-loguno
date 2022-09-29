import { THRESHOLDS } from "../constants";
import { colorizePerLevel, colorizePerKey } from "./colorize";

const regExp = /({\w+})/g;

const _substitute = (template, fields, colors = [], callback = null) => (
  template.replace(regExp, ((substring) => {
    const key = substring.slice(1, -1);
    const value = key === "level" ? THRESHOLDS[fields.level] : fields[key];

    if (callback) return callback(key, value, colors);

    return value;
  }))
);

/**
 * Replace template {key} by the corresponding value.
 *
 * @param {string} template - Has the form: "... {key} ...", so it -> "... value ...".
 * @param {Object} fields - The substitution key-value pairs.
 * @param {Object} colors - Color options.
 * @param {boolean} isFile - Will text be written to file and not console?
 * @returns {string}
 */
const formatText = (template, fields, colors, isFile = false) => {
  const level = THRESHOLDS[fields.level];
  const value = _substitute(template, fields);

  if (isFile) return value;

  if (colors.mono) {
    return colorizePerLevel(level, value, colors);
  }

  return _substitute(template, fields, colors, colorizePerKey);
};

export default formatText;
