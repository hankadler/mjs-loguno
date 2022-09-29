import colors from "color-name";
import TEMPLATES from "./TEMPLATES";
import LEVELS from "./LEVELS";

colors.lightorange = [254, 216, 177];
colors.lightred = [255, 204, 203];

const DEFAULTS = {
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
      message: [],
      name: []
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
      message: [],
      name: []
    }
  },
  isExclusive: true,
  template: TEMPLATES.lm,
  threshold: process.env.NODE_ENV === "production" ? LEVELS.WARN : LEVELS.TRACE
};

export default DEFAULTS;
