import { Clock, TimerClock } from './emulator/clock';
import { OpCodes } from './opcodes';

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
        this.trace('nope');
        this.move(1);
        break;

      case OpCodes.Halt:
      default:
        this.trace('halt');
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

  trace(...args): void {
    console.log(...args);
  }
}

export class Emulator {
  load(bytes: number[], clock: Clock = new TimerClock()): Program {
    return new Program(bytes, clock);
  }
}
