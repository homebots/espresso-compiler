import { Compiler, parse } from '../index';
import { CheckTypesPlugin } from './check-types.plugin';
import { FindIdentifiersPlugin } from './identifiers.plugin';

describe('CheckTypesPlugin', () => {
  function compile(program: string) {
    const compiler = new Compiler(parse);
    compiler.compile(program, [new FindIdentifiersPlugin(), new CheckTypesPlugin()]);
  }

  it('should not allow values that are incompatible when declaring a variable', () => {
    expect(() => compile(`uint $a = 'foo'`)).toThrow('Invalid value. Expected Integer but found String');
  });

  it('should not allow values that are incompatible when assigning a value', () => {
    expect(() =>
      compile(
        `uint $a = 1
         $a = 'foo'
        `,
      ),
    ).toThrow('Invalid value for $a. Expected Integer but found String');
  });

  it('should not allow assigning one variable to another if types do not match', () => {
    expect(() =>
      compile(
        `uint $a = 1
         byte $b = 0h

         $a = $b
        `,
      ),
    ).toThrow('Invalid value for $a. Expected Integer but found Byte');
  });

  describe('variable declaration', () => {
    it('should throw an error if a declared variable does not match the initial value', () => {
      const program = `byte $foo = '123'`;
      expect(() => compile(program)).toThrowError('Invalid value. Expected Byte but found String');
    });
  });
});
