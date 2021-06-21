import { Compiler } from './index';
// import { defaultParser } from './parser';

describe('Compiler', () => {
  const compiler = new Compiler();

  it('should parse an empty program', () => {
    expect(compiler.compile('')).toStrictEqual([]);
  });

  it('should delay execution for a given amount of time', () => {
    const program = `delay 1000`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0x02, 0xe8, 0x03, 0x00, 0x00]);
  });

  it('should stop execution', () => {
    const program = `halt`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xfe]);
  });

  it('should restart the program', () => {
    const program = `restart`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xfc]);
  });

  it('should do nothing', () => {
    const program = `noop`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0x01]);
  });

  it('should sleep for a given amount of time', () => {
    const program = `sleep 2000`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0x3f, 0xd0, 0x07, 0x00, 0x00]);
  });

  it('should jump to a given location', () => {
    const program = `jump to 0x00000001`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0x04, 0x01, 0x00, 0x00, 0x00]);
  });

  it('should delay a given time (micro seconds)', () => {
    const program = `yield 10`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xfa, 0x0a, 0x00, 0x00, 0x00]);
  });

  it('should print system information to serial output', () => {
    const program = `sysinfo`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xfd]);
  });

  it('should print program and execution memory details to serial output', () => {
    const program = `dump`;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xf9]);
  });

  it('should print a string serial output', () => {
    const program = `print 'foo'`;
    const characters = 'foo'.split('').map((c) => c.charCodeAt(0));
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0x03, ...characters, 0]);
  });

  it('should toggle serial output', () => {
    const program = `
    debug true
    noop
    debug false
    `;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([0xfb, 1, 1, 0xfb, 0]);
  });

  it('should jump to a given label', () => {
    const program = `
    @begin
      noop
      jump to end

    @middle
      noop
      jump to begin

    @end
      noop
      jump to middle
    `;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([
      // begin
      0x01,

      // jump to end (12)
      0x04, 0x0c, 0x00, 0x00, 0x00,

      // middle
      0x01,

      // jump to begin (0)
      0x04, 0x00, 0x00, 0x00, 0x00,

      // end
      0x01,

      // jump to middle (6)
      0x04, 0x06, 0x00, 0x00, 0x00,
    ]);
  });

  it('should jump to a label based on the value of a variable', () => {
    const program = `
      noop
    @begin
      noop
      if #0 then jump to begin
    `;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([
      0x01,

      // begin
      0x01,

      // jump if #0 to (1)
      0x0f, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]);
  });

  it('should allow a variable declaration', () => {
    const program = `
      var $a
      not $a, $a
    `;
    const output = compiler.compile(program);

    expect(output).toStrictEqual([]);
  });
});
