import path from "path";
import { get } from "stack-trace";

const _getFrameProps = (frame) => {
  const file = String(frame.getFileName()).replace("file://", "");
  const line = frame.getLineNumber();
  const col = frame.getColumnNumber();
  const func = frame.getFunctionName();
  const module = path.parse(file).name;
  const dotName = `${module}.${func}`;

  return { file, line, col, func, module, dotName };
};

const getStack = () => {
  let stack = get().slice(2);
  stack = stack.map((frame) => _getFrameProps(frame));
  stack = stack.filter(({ file }) => (
    file !== "null" && !file.startsWith("node:internal") && !file.includes("node_modules")
  ));
  return stack.reverse();
};

const getFrame = (index) => {
  try {
    return _getFrameProps(get()[index]);
  } catch {
    return {};
  }
};

export { getStack, getFrame };
