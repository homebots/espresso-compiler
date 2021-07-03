import { Compiler, Emulator, Program, StepClock, CaptureOutput } from './index';

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
    expectHops(program, stepper, [1, 2]);
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

  it('should run blinky', async () => {
    const emulator = new Emulator();
    const clock = new StepClock();
    const output = new CaptureOutput();
    const bytes = compiler.compile(`
      @begin
      io write pin 0, 0x01
      print 'on'
      delay 1000
      io write pin 0, 0x00
      print 'off'
      delay 1000
      jump to begin
    `);

    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    expectHops(program, clock, [4, 9, 15, 19, 25, 31, 0]);
    expect(output.lines.map((i: unknown[]) => i.join(' '))).toEqual([
      'io write 0 1',
      'print on',
      'delay 1000',
      'io write 0 0',
      'print off',
      'delay 1000',
    ]);
  });
});

function expectHops(program: Program, clock: StepClock, hops: number[]) {
  hops.forEach((hop) => {
    clock.tick();
    expect(program.counter).toBe(hop);
  });
}

// const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
