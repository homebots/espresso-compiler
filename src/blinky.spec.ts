import { CaptureOutput, compile, Emulator, StepClock } from './index';

describe('Blinky program', () => {
  it('should run blinky', () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compile(
      `
      byte $value
      byte $pin

      io write pin 0, $value
      delay 1000
      not $value, $value
      io write pin 0, $value
      delay 1000
      halt`,
    );

    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    console.log(bytes);

    clock.run();
    expect(output.lines.map((i: unknown[]) => i.join(' '))).toEqual([
      'declare 0, 2',
      'declare 1, 2',
      'io write 0, 0',
      'delay 1000',
      'not 0, 0',
      'io write 0, 1',
      'delay 1000',
      'halt',
    ]);
  });
});
