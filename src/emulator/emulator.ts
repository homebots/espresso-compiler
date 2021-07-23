import { bytesToNumber, OpCodes, ValueType } from '../compiler';
import { Clock, TimerClock } from './clock';
import { NullOutput, ProgramOutput } from './output';

class Value {
  constructor(public dataType: ValueType, public value: string | number, public id?: number) {}

  toString() {
    return String(this.value);
  }

  toNumber() {
    return Number(this.value);
  }

  toBoolean() {
    return Boolean(this.value);
  }
}

export class Program {
  constructor(readonly bytes: number[], readonly clock: Clock, readonly output: ProgramOutput) {
    this.endOfTheProgram = bytes.length;
    clock.onTick(() => this.tick());
  }

  counter = 0;
  paused = false;
  pins: number[] = Array(16).fill(0);
  variables: Value[] = Array(0xff);

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

      case OpCodes.Delay:
        this.delay();
        break;

      case OpCodes.JumpTo:
        this.jumpTo();
        break;

      case OpCodes.Declare:
        this.declareIdentifier();
        break;

      case OpCodes.IoWrite:
        this.ioWrite();
        break;

      case OpCodes.Not:
        this.notOperator();
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

  readValue(): Value {
    const type: ValueType = this.readByte();
    let value: string | number;

    switch (type) {
      case ValueType.Byte:
      case ValueType.Pin:
      case ValueType.Identifier:
        value = this.readByte();
        break;

      case ValueType.Integer:
      case ValueType.Address:
        value = this.readNumber();
        break;

      case ValueType.String:
        value = this.readString();
        break;
    }

    if (type === ValueType.Identifier) {
      return this.variables[value];
    }

    return new Value(type, value);
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
    const value = this.readValue();

    this.pins[pin] = value.toNumber();
    this.trace(`io write ${pin}, ${value}`);
  }

  delay(): void {
    const delay = this.readValue().toNumber();
    this.trace('delay', delay);

    this.clock.delay(delay);
  }

  jumpTo(): void {
    const position = this.readNumber();
    this.counter = position;
  }

  declareIdentifier(): void {
    const id = this.readByte();
    const type = this.readByte();

    this.trace(`declare ${id}, ${type}`);
    this.variables[id] = new Value(type, 0, id);
  }

  notOperator(): void {
    const target = this.readValue();
    const value = this.readValue();

    this.trace(`not ${target.id}, ${value.id}`);
    target.value = Number(!value.toBoolean());
  }
}

export class Emulator {
  load(bytes: number[], clock: Clock = new TimerClock(), output: ProgramOutput = new NullOutput()): Program {
    return new Program(bytes, clock, output);
  }
}
