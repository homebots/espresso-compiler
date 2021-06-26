import { Clock, TimerClock } from './emulator/clock';
import { NullOutput, ProgramOutput } from './emulator/output';
import { OpCodes } from './opcodes';
import { bytesToNumber, ValueType } from './types';

export class Program {
  constructor(readonly bytes: number[], readonly clock: Clock, readonly output: ProgramOutput) {
    this.endOfTheProgram = bytes.length;
    clock.onTick(() => this.tick());
  }

  counter = 0;
  paused = false;
  pins: number[] = Array(16).fill(0);

  private endOfTheProgram = 0;

  tick(): void {
    const next = this.readByte();

    switch (next) {
      case OpCodes.Noop:
        this.trace('noop');
        break;

      case OpCodes.Halt:
        this.trace('halt');
        this.clock.stop();
        break;

      case OpCodes.IoWrite:
        {
          const pin = this.readByte();
          const value = +this.readValue();
          this.pins[pin] = value;
          this.trace('io write', pin, value);
        }
        break;

      case OpCodes.Delay:
        {
          const delay = this.readValue();
          this.trace('delay', delay);
        }
        break;

      case OpCodes.JumpTo:
        {
          const position = this.readNumber();
          this.counter = position;
        }
        break;
    }

    if (this.counter >= this.endOfTheProgram) {
      this.clock.stop();
    }
  }

  move(amount: number): void {
    this.counter += amount;
  }

  trace(...args: unknown[]): void {
    this.output.trace(...args);
  }

  readByte(): number {
    const byte = this.bytes[this.counter];
    this.move(1);

    return byte;
  }

  readNumber(): number {
    const bytes = this.bytes.slice(this.counter, this.counter + 4);
    this.move(4);

    return bytesToNumber(bytes);
  }

  readValue(): string | number {
    const type: ValueType = this.readByte();

    switch (type) {
      case ValueType.Byte:
      case ValueType.Pin:
        return this.readByte();

      case ValueType.Integer:
      case ValueType.Address:
        return this.readNumber();
    }
  }
}

export class Emulator {
  load(bytes: number[], clock: Clock = new TimerClock(), output: ProgramOutput = new NullOutput()): Program {
    return new Program(bytes, clock, output);
  }
}
