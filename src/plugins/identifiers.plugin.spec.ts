import { Compiler } from '../compiler/index';
import { parse } from '../parser/index';
import { FindIdentifiersPlugin, ReplaceIdentifiersPlugin } from './identifiers.plugin';

describe('verify data types', () => {
  function compile(program: string) {
    const compiler = new Compiler(parse);
    compiler.compile(program, [new FindIdentifiersPlugin(), new ReplaceIdentifiersPlugin()]);
  }

  describe('identifiers', () => {
    it('should throw error if an identifier is redeclared', () => {
      expect(() =>
        compile(`
        byte $a = 0
        byte $a = 0
      `),
      ).toThrowError('Cannot redeclare identifier: $a');
    });

    it('should throw error if too many identifiers are declared', () => {
      const nodes = Array(256)
        .fill(0)
        .map((_, i) => 'byte $v' + i + ' = 0');

      const source = nodes.join('\n');

      expect(() => compile(source)).toThrowError('Too many identifiers');
    });
  });

  it('should not allow using identifiers that were not declared', () => {
    expect(() =>
      compile(
        `uint $a = 123
         print $b
        `,
      ),
    ).toThrow('Identifier not found: $b');
  });
});
