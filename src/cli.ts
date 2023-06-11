import { compile } from "./index.js";
import { createReadStream } from "node:fs";
import process from "node:process";
import { Buffer } from "node:buffer";

function main() {
  const args = process.argv.slice(2);
  let stdin = process.stdin;

  if (!args[0]) {
    process.stdin.resume();
  } else {
    stdin = createReadStream(args[0]);
  }

  const b = [];
  stdin.on("data", (c) => b.push(c));
  stdin.on("end", () => compileBuffer(Buffer.concat(b)));
}

function compileBuffer(buffer) {
  buffer.toString("utf8");
  const bytes = compile(buffer);
  process.stdout.write(Buffer.from(bytes));
}

main();
