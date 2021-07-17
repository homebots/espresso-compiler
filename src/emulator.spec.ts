import { Compiler, Emulator, StepClock } from './index';

describe('vm emulator', () => {
  const compiler = new Compiler();

  it('should run one instruction and halt program', async () => {
    const emulator = new Emulator();
    const stepper = new StepClock();
    const bytes = compiler.compile(
      `
      noop
      halt
    `,
    );

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
    const bytes = compiler.compile(
      `
      noop
      noop
    `,
    );

    const program = emulator.load(bytes, stepper);
    expect(program.counter).toBe(0);

    stepper.tick();
    stepper.tick();
    stepper.tick();

    expect(program.counter).toBe(2);
  });
});
