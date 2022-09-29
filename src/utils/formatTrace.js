import commonPathPrefix from "common-path-prefix";

const formatTrace = (stack) => {
  const commonPath = commonPathPrefix(stack.map(({ file }) => file));
  const result = [`  ${commonPath || "."}`];
  const symbol = "|-- ";
  stack.forEach(({ file, line, col }, index) => {
    const prefix = "    ".repeat(index);
    result.push(`  ${prefix}${symbol}${file.replace(commonPath, "")}[${line}:${col}]`);
  });
  return result.join("\n");
};

export default formatTrace;
