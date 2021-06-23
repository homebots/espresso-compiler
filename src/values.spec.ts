import { Compiler } from './index';

describe('Values', () => {
  const compiler = new Compiler();

  it('should allow a ', () => {
    const program = `
      noop
    `;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([1]);
  });
});
