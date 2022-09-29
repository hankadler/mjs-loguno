import chalk from "chalk";

const _colorizeBg = (value, bg) => (bg.length ? chalk.bgRgb(...bg)(value) : value);

const _colorizeFg = (value, fg) => (fg.length ? chalk.rgb(...fg)(value) : value);

const _colorize = (value, colors, bg, fg) => {
  let result = value;

  if (colors.bg.enabled && bg.length) {
    result = colors.inverted ? _colorizeBg(result, fg) : _colorizeBg(result, bg);
  }

  if (colors.fg.enabled && fg.length) {
    result = colors.inverted ? _colorizeFg(result, bg) : _colorizeFg(result, fg);
  }

  return result;
};

const colorizePerLevel = (level, value, colors) => {
  const bg = colors.bg.level[level];
  const fg = colors.fg.level[level];

  return _colorize(value, colors, bg, fg);
};

const colorizePerKey = (key, value, colors) => {
  const bg = key === "level" ? colors.bg.level[value] : colors.bg[key];
  const fg = key === "level" ? colors.fg.level[value] : colors.fg[key];

  return _colorize(value, colors, bg, fg);
};

export { colorizePerKey, colorizePerLevel };
