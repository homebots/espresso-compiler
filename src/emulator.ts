import { OpCodes } from './opcodes';

export interface Clock {
  onTick(fn: () => void): void;
  start(): void;
  stop(): void;
}

export class StepClock implements Clock {
  steps = 0;
  paused = false;

  start(): void {
    this.steps = 0;
    this.paused = false;
  }

  stop(): void {
    this.steps = 0;
    this.paused = true;
  }

  private fn: () => void;

  onTick(fn: () => void): void {
    this.fn = fn;
  }

  tick(): void {
    if (!this.paused) {
      this.fn();
      this.steps++;
    }
  }
}

export class TimerClock implements Clock {
  private fn: () => void;
  private timer: unknown;

  onTick(fn: () => void): void {
    this.fn = fn;
  }

  start(): void {
    this.timer = setTimeout(() => this.fn(), 1);
  }

  stop(): void {
    clearTimeout(this.timer as number);
    this.timer = 0;
  }
}

export class Program {
  constructor(readonly bytes: number[], readonly clock: Clock) {
    this.endOfTheProgram = bytes.length - 1;
    clock.onTick(() => this.tick());
  }

  exitCode = 0;
  counter = 0;
  paused = false;

  private endOfTheProgram = 0;

  tick(): void {
    const next = this.bytes[this.counter];

    switch (next) {
      case OpCodes.Noop:
        console.log('nope');
        this.move(1);
        break;

      case OpCodes.Halt:
      default:
        console.log('halt');
        this.clock.stop();
        break;
    }

    if (this.counter === this.endOfTheProgram) {
      this.clock.stop();
    }
  }

  move(amount: number): void {
    this.counter += amount;
  }
}

export class Emulator {
  load(bytes: number[], clock: Clock = new TimerClock()): Program {
    return new Program(bytes, clock);
  }
}
