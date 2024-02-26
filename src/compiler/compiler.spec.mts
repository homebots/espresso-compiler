import { bytesToNumber, OpCodes, ValueType, compile } from '../index.mjs';
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

  it('should delay execution for a given amount of time', () => {
    const program = `delay 1000`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Delay, ValueType.Integer, 0xe8, 0x03, 0x00, 0x00]);
  });

  it('should stop execution', () => {
    const program = `halt`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Halt]);
  });

  it('should restart the program', () => {
    const program = `restart`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Restart]);
  });

  it('should do nothing', () => {
    const program = `noop`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Noop]);
  });

  it('should sleep for a given amount of time', () => {
    const program = `sleep 2000`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Sleep, ValueType.Integer, 0xd0, 0x07, 0x00, 0x00]);
  });

  it('should delay a given time (micro seconds)', () => {
    const program = `yield`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Yield]);
  });

  it('should print system information to serial output', () => {
    const program = `sysinfo`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.SystemInfo]);
  });

  it('should print program and execution memory details to serial output', () => {
    const program = `dump`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Dump]);
  });

  it('should print values to serial output', () => {
    const program = `
    print 1048576
    print 'foo'
    print 5
    print -128
    `;
    const characters = 'foo'.split('').map((c) => c.charCodeAt(0));
    const output = compile(program);

    expect(output).toStrictEqual([
      OpCodes.Print,
      ValueType.Integer,
      0,
      0,
      16,
      0,
      OpCodes.Print,
      ValueType.String,
      ...characters,
      0,
      OpCodes.Print,
      ValueType.Integer,
      5,
      0,
      0,
      0,
      OpCodes.Print,
      ValueType.SignedInteger,
      128,
      255,
      255,
      255,
    ]);
    expect(bytesToNumber([0, 0, 16, 0])).toBe(1048576);
  });

  it('should toggle serial output', () => {
    const program = `
    debug true
    noop
    debug off
    `;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Debug, ValueType.Byte, 0x1, OpCodes.Noop, OpCodes.Debug, ValueType.Byte, 0]);
  });

  it('should declare functions', () => {
    const program = `
    fn fn {
    }
    `;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Define, ValueType.Integer, 1, 0, 0, 0, OpCodes.Return]);
  });

  it('should jump to a function', () => {
    const program = `
    fn first {
      print 1
    }

    fn second {
      print 2
      first()
    }

    fn third {
      print 3
      second()
    }

    third()
    `;
    const output = compile(program);
    expect(output).toStrictEqual([
      OpCodes.Define,
      ValueType.Integer,
      7,
      0,
      0,
      0,
      OpCodes.Print,
      ValueType.Integer,
      1,
      0,
      0,
      0,
      OpCodes.Return,
      OpCodes.Define,
      ValueType.Integer,
      13,
      0,
      0,
      0,
      OpCodes.Print,
      ValueType.Integer,
      2,
      0,
      0,
      0,
      OpCodes.JumpTo,
      ValueType.Address,
      6,
      0,
      0,
      0,
      OpCodes.Return,
      OpCodes.Define,
      ValueType.Integer,
      13,
      0,
      0,
      0,
      OpCodes.Print,
      ValueType.Integer,
      3,
      0,
      0,
      0,
      OpCodes.JumpTo,
      ValueType.Address,
      19,
      0,
      0,
      0,
      OpCodes.Return,
      OpCodes.JumpTo,
      ValueType.Address,
      38,
      0,
      0,
      0,
    ]);
  });

  it('should call a function if a condition is met', () => {
    const program = `
    byte $a = ffh

    fn begin {
    }

    if 0 then
      begin()
    `;

    const output = compile(program);

    expect(output).toStrictEqual([
      OpCodes.Declare,
      0,
      ValueType.Byte,
      0xff,
      OpCodes.Define,
      ValueType.Integer,
      1,
      0,
      0,
      0,
      OpCodes.Return,
      OpCodes.JumpIf,
      ValueType.Integer,
      0,
      0,
      0,
      0,
      ValueType.Address,
      10,
      0,
      0,
      0,
    ]);
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

  it('should enable interrupts', () => {
    const program = `
    fn onPinUp {
    }

    when pin 2 is true onPinUp()
    `;
    const output = compile(program);

    expect(output).toStrictEqual([
      OpCodes.Define,
      ValueType.Integer,
      1,
      0,
      0,
      0,
      OpCodes.Return,
      OpCodes.Iointerrupt,
      ValueType.Pin,
      2,
      ValueType.Byte,
      5,
      ValueType.Address,
      6,
      0,
      0,
      0,
    ]);
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
