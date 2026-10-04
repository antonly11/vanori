import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const requireFromProject = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../", import.meta.url));
const cache = new Map();

// Run the real pure TypeScript rules with the project's existing compiler.
// No extra test runtime or application dependency is needed.
function loadTypeScript(relative) {
  const file = path.isAbsolute(relative) ? relative : path.join(root, relative);
  if (cache.has(file)) return cache.get(file);
  const moduleRecord = { exports: {} };
  cache.set(file, moduleRecord.exports);
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const resolve = (name) => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return requireFromProject(name);
    const base = name.startsWith("@/") ? path.join(root, "src", name.slice(2)) : path.resolve(path.dirname(file), name);
    return loadTypeScript(base.endsWith(".ts") ? base : `${base}.ts`);
  };
  vm.runInNewContext(output, { module: moduleRecord, exports: moduleRecord.exports, require: resolve }, { filename: file });
  return moduleRecord.exports;
}
export { loadTypeScript };
export const plain = (value) => JSON.parse(JSON.stringify(value));
