import * as peg from 'pegjs';
import * as helpers from './helpers';
import { flatten } from './helpers';
import { Node } from './syntax/node';
import * as T from './tokens';

export class Parser {
  private parser: peg.Parser;

  constructor(private grammar: string = '') {}

  parse(code: string) {
    return this.parser.parse(code);
  }

  setGrammar(grammar: string) {
    this.grammar = grammar;
    this.parser = this.createParser();
  }

  private createParser() {
    if (!this.grammar) {
      throw new Error('Missing gramar definitions');
    }

    const parserCode = peg.generate(this.grammar, { output: 'source', optimize: 'speed' });
    const parserFunction = Function('_', 'T', 'helpers', 'return 0, ' + parserCode);
    const parser = parserFunction(helpers, T) as unknown as peg.Parser;

    return parser;
  }
}
