import { build } from "esbuild";
import { statSync } from "node:fs";

await build({
  entryPoints: ["src/index.js"],
  outfile: "../assets/m3e.js",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  legalComments: "none",
  logLevel: "info",
});

const kb = (statSync("../assets/m3e.js").size / 1024).toFixed(0);
console.log(`assets/m3e.js -> ${kb} KB`);
