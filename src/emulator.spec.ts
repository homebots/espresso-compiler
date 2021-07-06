import { Compiler, Emulator, StepClock, CaptureOutput } from './index';

describe('vm emulator', () => {
  const compiler = new Compiler();

  it('should run one instruction and halt program', async () => {
    const emulator = new Emulator();
    const stepper = new StepClock();
    const bytes = compiler.compile(`
      noop
      halt
    `);

    const program = emulator.load(bytes, stepper);
    expect(program.counter).toBe(0);

    stepper.tick();
    expect(program.counter).toBe(1);

    stepper.tick();
    expect(program.counter).toBe(2);
  });

  it('should stop program if there are no further instruction', async () => {
    const emulator = new Emulator();
    const stepper = new StepClock();
    const bytes = compiler.compile(`
      noop
      noop
    `);

    const program = emulator.load(bytes, stepper);
    expect(program.counter).toBe(0);

    stepper.tick();
    stepper.tick();
    stepper.tick();

    expect(program.counter).toBe(2);
  });

  it('should run blinky', () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compiler.compile(`
      io write pin 0, 0x01
      delay 1000
      io write pin 0, 0x00
      delay 1000
      halt
    `);

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
