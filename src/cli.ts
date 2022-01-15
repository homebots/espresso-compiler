#!/usr/bin/env node

import { compile, Emulator, LogOutput, Program, RealTimeClock } from './index';
import { Transform } from 'stream';
import parseArgs from 'minimist';

class Compiler extends Transform {
  private _options: Record<string, string>;

  get options() {
    return this._options || (this._options = parseArgs(process.argv.slice(2)));
  }

  _transform(code: string, _, next: () => void) {
    const bytes = compile(code.toString().trim());
    try {
      const encoded = this.encode(bytes);
      this.push(encoded);
      next();
    } catch {
      this.emit('error', bytes);
    }
  }

  encode(bytes: number[]) {
    if (this.options.run) {
      this.run(bytes);
      return 'Running...\n';
    }

    switch (this.options.format) {
      case 'hex':
        return Buffer.from(bytes).toString('hex') + '\n';

      case 'c':
        return '{' + bytes.map((byte) => '0x' + byte.toString(16)).join(', ') + '}\n';

      case 'js':
        return 'export default [' + bytes.map((byte) => '0x' + byte.toString(16)).join(', ') + ']\n';

      case 'bin':
      default:
        return Buffer.from(bytes);
    }
  }

  run(bytes: number[]) {
    const output = new LogOutput();
    const emulator = new Emulator();
    const clock = new RealTimeClock();
    const program = emulator.load(bytes, clock, output);

    program.onError((error: Error) => {
      console.log(error.message);
      console.log(this.hexDump(program));
    });

    clock.start();
  }

  hexDump(program: Program) {
    const { bytes } = program;
    const leftLength = String(bytes.length).length;
    const leftPad = (number: number | string, length: number, char = '0') =>
      char.repeat(length - String(number).length) + number;
    const dump = [[]];
    let next = dump[0];

    bytes.forEach((byte, index) => {
      if (index === 10 || (index > 1 && index % 10 === 0)) {
        dump.push((next = []));
      }

      next.push(leftPad(byte.toString(16), 2));
    });

    const header =
      leftPad('', leftLength, ' ') +
      ' ' +
      Array(10)
        .fill(' ')
        .map((_, i) => leftPad(i, 2, ' '))
        .join(' ');

    const rows = dump
      .map((nextRow, index) => leftPad(index * 10, leftLength, ' ') + ' ' + nextRow.join(' '))
      .join('\n');

    return header + '\n' + rows;
  }
}

process.stdin.pipe(new Compiler()).pipe(process.stdout);
