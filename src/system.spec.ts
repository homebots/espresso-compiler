import { bytesToNumber, OpCodes, ValueType, compile } from './index';

describe('Compiler', () => {
  it('should parse an empty program', () => {
    expect(compile('')).toStrictEqual([]);
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

  it('should jump to a given location', () => {
    const program = `jump to 0x00000001`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.JumpTo, ValueType.Address, 0x01, 0x00, 0x00, 0x00]);
  });

  it('should delay a given time (micro seconds)', () => {
    const program = `yield 10`;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Yield, ValueType.Integer, 0x0a, 0x00, 0x00, 0x00]);
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
    ]);
    expect(bytesToNumber([0, 0, 16, 0])).toBe(1048576);
  });

  it('should toggle serial output', () => {
    const program = `
    debug true
    noop
    debug false
    `;
    const output = compile(program);

    expect(output).toStrictEqual([OpCodes.Debug, 0x1, OpCodes.Noop, OpCodes.Debug, 0]);
  });

  it('should jump to a given label', () => {
    const program = `
    @begin
      noop
      jump to label end

    @middle
      noop
      jump to label begin

    @end
      noop
      jump to label middle
    `;
    const output = compile(program);

    expect(output).toStrictEqual([
      // begin
      0x01,

      // jump to end (12)
      OpCodes.JumpTo,
      ValueType.Address,
      0x0c,
      0x00,
      0x00,
      0x00,

      // middle
      0x01,

      // jump to begin (0)
      OpCodes.JumpTo,
      ValueType.Address,
      0x00,
      0x00,
      0x00,
      0x00,

      // end
      0x01,

      // jump to middle (6)
      OpCodes.JumpTo,
      ValueType.Address,
      0x06,
      0x00,
      0x00,
      0x00,
    ]);
  });

  it('should jump to a given label if a condition is met', () => {
    const program = `
    @begin
    if 1 then jump to label begin
    `;

    const output = compile(program);

    expect(output).toStrictEqual([
      OpCodes.JumpIf,
      ValueType.Integer,
      0x01,
      0,
      0,
      0,
      ValueType.Address,
      0x00,
      0x00,
      0x00,
      0x00,
    ]);
  });
});
