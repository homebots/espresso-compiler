import { LogOutput, Emulator, StepperClock, compile, RealTimeClock } from '../index';

describe('vm emulator', () => {
  it('should throw an error for invalid instructions', async () => {
    const emulator = new Emulator();
    const stepper = new StepperClock();
    const bytes = [0];

    emulator.load(bytes, stepper);

    expect(() => stepper.tick()).toThrow('Invalid opcode: 0');
  });

  it('should load bytes into a program and return it', async () => {
    const emulator = new Emulator();
    const bytes = compile(`noop`);
    const program = emulator.load(bytes);

    expect(program.counter).toBe(0);
    expect(program.bytes).toEqual(bytes);
  });

  it('should run the program with a real clock', async () => {
    const emulator = new Emulator();
    const clock = new RealTimeClock();
    const bytes = compile(
      `
      noop
      delay 5
      noop
      halt`,
    );

    const program = emulator.load(bytes, clock);
    expect(program.counter).toBe(0);

    clock.start();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(program.counter).toBe(program.bytes.length);
    clock.stop();

    expect(clock.paused).toBe(true);
    clock.tick();

    expect(clock.paused).toBe(true);
    expect(program.counter).toBe(program.bytes.length);
  });

  it('should log steps', async () => {
    const emulator = new Emulator();
    const stepper = new StepperClock();
    const program = `
    uint $number = 0
    print $number
    noop
    `;
    const bytes = compile(program);
    const logger = jest.spyOn(console, 'log').mockImplementation(() => 0);

    emulator.load(bytes, stepper, new LogOutput());
    stepper.run();

    expect(logger).toHaveBeenNthCalledWith(1, 'declare #0', 'Integer', '0');
    expect(logger).toHaveBeenNthCalledWith(2, 'print', '0');
    expect(logger).toHaveBeenNthCalledWith(3, 'noop');
    expect(logger).toHaveBeenNthCalledWith(4, 'halt');
  });
});
