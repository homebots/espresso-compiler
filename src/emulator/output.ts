export interface ProgramOutput {
  trace(...args: unknown[]): void;
}

export class NullOutput implements ProgramOutput {
  trace(..._args: unknown[]): void {
    return;
  }
}

export class LogOutput implements ProgramOutput {
  trace(...args: unknown[]): void {
    console.log(...args);
  }
}

export class CaptureOutput implements ProgramOutput {
  readonly lines: unknown[] = [];

  trace(...args: unknown[]): void {
    this.lines.push(args);
  }
}
