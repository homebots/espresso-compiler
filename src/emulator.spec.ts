import { Compiler } from './compiler';
import { Emulator } from './emulator';

describe('vm emulator', () => {
  const compiler = new Compiler();

  it('should run an input program', () => {
    const emulator = new Emulator();
    const bytes = compiler.compile(`halt`);
    const exitCode = emulator.run(bytes);

    expect(exitCode).toBe(0);
  });
});
