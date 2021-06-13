import { createParser } from './parser';

describe('createParser', () => {
  it('creates a parser from a grammar text', () => {
    const grammar = `
      Program = SumOperation
      SumOperation = a:Number SumOperator b:Number { return a + b }
      SumOperator = '+'
      Number = [0-9]+ { return Number(text()) }
    `;

    const parser = createParser(grammar);
    const output = parser.parse('1+2');

    expect(output).toBe(3);
  });
});
