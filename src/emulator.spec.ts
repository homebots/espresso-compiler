import { Compiler } from './compiler';
import { Emulator, StepClock } from './emulator';

describe('vm emulator', () => {
  const compiler = new Compiler();

  it('should run an input program', async () => {
    const emulator = new Emulator();
    const stepper = new StepClock();
    const bytes = compiler.compile(`
      noop
      halt
    `);
    const program = emulator.load(bytes, stepper);

    expect(program.exitCode).toBe(0);
    expect(program.counter).toBe(0);

    stepper.tick();
    expect(program.counter).toBe(1);

    stepper.tick();
    expect(program.counter).toBe(2);
    expect(program.exitCode).toBe(0);
  });
});

// const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
