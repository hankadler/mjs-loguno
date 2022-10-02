import colors from "color-name";
import TEMPLATES from "./TEMPLATES";
import LEVELS from "./LEVELS";

colors.lightorange = [254, 216, 177];
colors.lightred = [255, 204, 203];

/**
 * @typedef LevelColor
 * @property {number[]} TRACE - The rbg to apply to TRACE messages.
 * @property {number[]} DEBUG - The rbg to apply to DEBUG messages.
 * @property {number[]} INFO - The rbg to apply to INFO messages.
 * @property {number[]} WARN - The rbg to apply to WARN messages.
 * @property {number[]} ERROR - The rbg to apply to ERROR messages.
 * @property {number[]} FATAL - The rbg to apply to FATAL messages.
 */

/**
 * @typedef FieldColor
 * @property {boolean} enabled - Apply this color settings?
 * @property {Array} duration - The rgb to apply to duration.
 * @property {LevelColor} level - The rgb per level.
 * @property {Array} name - The rbg to apply to name.
 * @property {Array} message - The rgb to apply to message.
 */

/**
 * @typedef OutletColor
 * @property {boolean} mono - Apply color of level to all?
 * @property {Array} inverted - Invert fg and bg colors?
 * @property {FieldColor} fg - Foreground color settings.
 * @property {FieldColor} bg - Background color settings.
 */

/**
 * @typedef OutletConfig
 * @property {boolean} isExclusive - Log only when message originates from outlet creator?
 * @property {Level} threshold - The ``Level`` message must exceed to show up.
 * @property {Template} template - The format template.
 * @property {OutletColor} colors - The color settings.
 * @mixin
 */

/**
 * @type {OutletConfig}
 */
const OUTLET_CONFIG = {
  isExclusive: true,
  threshold: process.env.NODE_ENV === "production" ? LEVELS.WARN : LEVELS.TRACE,
  template: TEMPLATES.lm,
  colors: {
    mono: false,
    inverted: true,
    bg: {
      enabled: true,
      duration: [],
      level: {
        TRACE: colors.whitesmoke,
        DEBUG: colors.lightblue,
        INFO: colors.lightgreen,
        WARN: colors.lightorange,
        ERROR: colors.lightred,
        FATAL: colors.indianred
      },
      name: [],
      message: []
    },
    fg: {
      enabled: true,
      duration: [],
      level: {
        TRACE: colors.dimgray,
        DEBUG: colors.darkblue,
        INFO: colors.darkgreen,
        WARN: colors.orangered,
        ERROR: colors.red,
        FATAL: colors.darkred
      },
      name: [],
      message: []
    }
  },
};

export default OUTLET_CONFIG;
