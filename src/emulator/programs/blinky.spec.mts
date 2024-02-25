import { CaptureOutput, compile, Emulator, StepClock } from '../../index.mjs';

describe('Blinky program', () => {
  it('should run blinky', () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compile(
      `
      // blinks a pin and loops back to zero
      // use tick() instead of run() to avoid infinite loop

      fn on {
        io_write #0, true
        delay 1000
      }

      fn off {
        io_write #0, false
        delay 1000
      }

      fn loop {
        on()
        off()
        loop()
      }

      loop()
      `,
    );
    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    clock.tick(13);

    expect(output.lines).toEqual([
      'define 12',
      'define 12',
      'define 19',
      'jump to 42',
      'jump to 6',
      'io write pin 0, 1',
      'delay 1000',
      'return to 48',
      'jump to 24',
      'io write pin 0, 0',
      'delay 1000',
      'return to 54',
      'jump to 42',
    ]);
  });
});
