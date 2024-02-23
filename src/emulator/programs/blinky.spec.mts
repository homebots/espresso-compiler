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

      loop()

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
      `,
    );
    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    clock.tick(13);

    expect(output.lines).toEqual([
      'jump to 32',
      'define',
      'jump to 6',
      'define',
      'io write pin 0, 1',
      'delay 1000',
      'return to 39',
      'jump to 19',
      'define',
      'io write pin 0, 0',
      'delay 1000',
      'return to 45',
      'jump to 32',
    ]);
  });
});
