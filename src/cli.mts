import { compile } from './index.js';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { Buffer } from 'node:buffer';

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '-') {
    const format = args[1] || '';
    const b = [];
    process.stdin.on('data', (c) => b.push(c));
    process.stdin.on('end', () => {
      const source = Buffer.concat(b).toString('utf8');
      compileAndPrint(source, format);
    });
    process.stdin.resume();
  } else {
    const format = args[1] || '';
    const source = readFileSync(args[0], 'utf8');
    compileAndPrint(source, format);
  }
}

function compileAndPrint(source, format) {
  const buffer = Buffer.from(compile(source));

  if (format === 'js') {
    console.log('export default [');
    buffer.forEach((byte) => process.stdout.write('0x' + byte.toString(16) + ',\n'));
    console.log('];');
    return;
  }

  process.stdout.write(format ? buffer.toString(format) : buffer);
}

try {
  main();
} catch (error) {
  console.error(String(error));
  console.log('Usage: esp <file.esp|-> [format]\ncat file.esp | esp - hex\nesp path/to/file.esp js\n\nFormat: js, hex, utf8, base64. Defaults to binary')
}
