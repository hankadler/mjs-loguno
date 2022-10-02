import colors from "color-name";
import TEMPLATES from "./TEMPLATES";
import LEVELS from "./LEVELS";

colors.lightorange = [254, 216, 177];
colors.lightred = [255, 204, 203];

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
