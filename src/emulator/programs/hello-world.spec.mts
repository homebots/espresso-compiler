import { CaptureOutput, compile, Emulator, TimerClock } from '../../index.mjs';

describe('Hello world program', () => {
  it('should run', () => {
    const emulator = new Emulator();
    const clock = new TimerClock();
    const output = new CaptureOutput();
    const bytes = compile(`
    say 'hello'
    `);

    const program = emulator.load(bytes, clock, output);

    expect(program.counter).toBe(0);
    expect(program.pins[0]).toBe(0);

    clock.tick();

    expect(output.lines).toEqual(['print hello', 'halt']);
  });
});
