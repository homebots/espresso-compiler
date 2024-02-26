import { OpCodes, ValueType, compile } from '../index.mjs';
import { Compiler } from './compiler.mjs';
import { defaultPlugins } from './plugins/index.mjs';

describe('Compiler', () => {
  it('should parse an empty program', () => {
    expect(compile('')).toStrictEqual([]);
  });

  it('should ignore comments', () => {
    expect(compile('// nothing')).toStrictEqual([]);
  });

  it('should throw an error for invalid syntax', () => {
    expect(() => compile('not valid')).toThrowError(
      '1:1: Expected end of input or statement but "n" found.\nnot valid\n^',
    );
  });

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
         uint $c = 2

         $a = $c
         $a = $b
        `,
      ),
    ).toThrow('Invalid value for $a. Expected Integer but found Byte');
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

  it('should compile a list of nodes', () => {
    const compiler = new Compiler();
    const nodes = compiler.parse('halt');
    const program = compiler.compile(nodes, defaultPlugins);

    expect(program).toEqual([OpCodes.Halt]);
  });

  it('should throw an error if a function is called but not defined', () => {
    const program = `
    foo()
    `;
    expect(() => compile(program)).toThrow('Function "foo" was not defined');
  });

  it('should throw an error if a function is defined twice', () => {
    const program = `
    fn foo {

    }

    fn foo {

    }
    `;
    expect(() => compile(program)).toThrow('Cannot redeclare function "foo"');
  });

  it('should compute length of all valid types', () => {
    const output = compile(`
    byte $byte = 1h
    boolean $bool = true
    address $address = 0x00000000
    uint $uint = 1
    int $int = -2
    string $string = 'hello'
    `);

    expect(output).toEqual([
      OpCodes.Declare,
      0,
      ValueType.Byte,
      1,
      OpCodes.Declare,
      1,
      ValueType.Byte,
      1,
      OpCodes.Declare,
      2,
      ValueType.Address,
      0,
      0,
      0,
      0,
      OpCodes.Declare,
      3,
      ValueType.Integer,
      1,
      0,
      0,
      0,
      OpCodes.Declare,
      4,
      ValueType.SignedInteger,
      254,
      255,
      255,
      255,
      OpCodes.Declare,
      5,
      ValueType.String,
      104,
      101,
      108,
      108,
      111,
      0,
    ]);
  });
});
