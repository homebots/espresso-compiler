import { CaptureOutput, Compiler, Emulator, StepClock } from './index';

describe('Blinky program', () => {
  const compiler = new Compiler();

  it('should run blinky', () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compiler.compile(
      `
    io write pin 0, 0x01
    delay 1000
    io write pin 0, 0x00
    delay 1000
    halt
  `,
    );

    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    clock.run();
    expect(output.lines.map((i: unknown[]) => i.join(' '))).toEqual([
      'io write 0 1',
      'delay 1000',
      'io write 0 0',
      'delay 1000',
      'halt',
    ]);
  });
});
