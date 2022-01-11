import { compile } from './compiler/index.js';
import { Transform } from 'stream';
import parseArgs from 'minimist';

class Compiler extends Transform {
  private _options: Record<string, string>;

  get options() {
    return this._options || (this._options = parseArgs(process.argv.slice(2)));
  }

  _transform(code: string, _, next: () => void) {
    const bytes = compile(code.toString());
    this.push(this.encode(bytes));
    next();
  }

  encode(bytes: number[]) {
    switch (this.options.format) {
      case 'hex':
        return Buffer.from(bytes).toString('hex') + '\n';

      case 'c':
        return '{' + bytes.map((byte) => '0x' + byte).join(', ') + '}\n';

      case 'js':
        return 'export default [' + bytes.map((byte) => '0x' + byte.toString(16)).join(', ') + ']\n';

      case 'bin':
      default:
        return Buffer.from(bytes);
    }
  }
}

process.stdin.pipe(new Compiler()).pipe(process.stdout);
