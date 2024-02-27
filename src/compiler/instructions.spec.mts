import { bytesToNumber, OpCodes, ValueType, compile } from '../index.mjs';

describe('language instructions', () => {
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

  it('should enable interrupts', () => {
    const program = `
    noop
    fn onPinUp {}

    when pin 2 is rising onPinUp()
    `;
    const output = compile(program);

    expect(output).toStrictEqual([
      OpCodes.Noop,
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
      1,
      ValueType.Address,
      7,
      0,
      0,
      0,
    ]);
  });

  it('should read and write from IO pins', () => {
    const program = `
    byte $value = 0h

    io_read $value, pin 2
    $value <- #2

    io_write pin 2, $value
    #2 <- $value
    `;

    const bytes = compile(program);

    expect(bytes).toEqual([
      OpCodes.Declare,
      0,
      ValueType.Byte,
      0,
      OpCodes.IoRead,
      ValueType.Pin,
      2,
      ValueType.Identifier,
      0,
      OpCodes.IoRead,
      ValueType.Pin,
      2,
      ValueType.Identifier,
      0,
      OpCodes.IoWrite,
      ValueType.Pin,
      2,
      ValueType.Identifier,
      0,
      OpCodes.IoWrite,
      ValueType.Pin,
      2,
      ValueType.Identifier,
      0,
    ]);
  });
});
