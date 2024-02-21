import { CaptureOutput, compile, Emulator, StepClock } from '../index.mjs';

describe('Blinky program', () => {
  it('should run blinky', () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compile(
      `
      // blinks a pin and loops back to zero
      // using tick() instead of run() to avoid infinite loop
      def begin
        io_write pin 0, 1
        delay 1000
        io_write #0, 0
        delay 1000

      begin()
      `,
    );

    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    clock.tick(5);

    expect(output.lines).toEqual([
      'io write pin 0, 1',
      'delay 1000',
      'io write pin 0, 0',
      'delay 1000',
      'jump to 0',
    ]);
  });
});
