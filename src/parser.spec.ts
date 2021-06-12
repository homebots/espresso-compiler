import { Parser } from './parser';

describe('Parser', () => {
  const testGrammar = `
  {
    class StringNode {
      constructor(string) {this.string = string}

      get bytes() {
        return this.string.split('');
      }
    }

    class NumberNode {
      constructor(number) {this.number = number}
      get bytes() {
        return [this.number];
      }
    }
  }

  program = tokens:(t:token space?)* { return tokens.map(t => t[0]) }
  space = [ ]
  token = word / number
  word = head:[a-z] tail:[a-z]* { return new StringNode(head + tail.join('')) }
  number = [0] { return 0 } / head:[1-9] tail:[0-9]* { return new NumberNode(parseInt(text())) }
  `;

  it('should parse code with the given grammar', () => {
    const parser = new EspParser();
    parser.setGrammar(testGrammar);
    const output = parser.parse('the answer is 42');
    const bytes = output.map((node) => node.bytes);
    expect(bytes).toEqual([['t', 'h', 'e'], ['a', 'n', 's', 'w', 'e', 'r'], ['i', 's'], [42]] as any);
  });

  it('should throw an exception if grammar was not defined', () => {
    const parser = new EspParser();
    expect(() => parser.parse('')).toThrow();
  });
});
