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
        this.halt();
        break;

      case OpCodes.Print:
        this.print();
        break;

      case OpCodes.IoWrite:
        this.ioWrite();
        break;

      case OpCodes.Delay:
        this.delay();
        break;

      case OpCodes.JumpTo:
        this.jumpTo();
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

  readString(): string {
    const string = [];

    while (this.bytes[this.counter] !== 0) {
      string.push(String.fromCharCode(this.bytes[this.counter]));
      this.move(1);
    }

    this.move(1);

    return string.join('');
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

      case ValueType.String:
        return this.readString();
    }
  }

  halt(): void {
    this.trace('halt');
    this.clock.stop();
  }

  print(): void {
    const value = this.readValue();
    this.trace('print', value);
  }

  ioWrite(): void {
    const pin = this.readByte();
    const value = +this.readValue();
    this.pins[pin] = value;
    this.trace('io write', pin, value);
  }

  delay(): void {
    const delay = this.readValue();
    this.trace('delay', delay);
  }

  jumpTo(): void {
    const position = this.readNumber();
    this.counter = position;
  }
}

export class Emulator {
  load(bytes: number[], clock: Clock = new TimerClock(), output: ProgramOutput = new NullOutput()): Program {
    return new Program(bytes, clock, output);
  }
}
