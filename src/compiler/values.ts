import { bytesToNumber, numberToInt32, stringToBytes } from './data-convertion';

export enum ValueType {
  Identifier = 1,
  Byte,
  Pin,
  Address,
  Integer,
  SignedInteger,
  String,
}

abstract class ValueAbstract {
  readonly type: ValueType;
}

export class IdentifierValue extends ValueAbstract {
  readonly type = ValueType.Identifier;
  constructor(readonly value: number) {
    super();
  }

  static create(value: number): unknown {
    return [new IdentifierValue(value)];
  }
}

export class ByteValue extends ValueAbstract {
  readonly type = ValueType.Byte;
  constructor(readonly value: number) {
    super();
  }

  static create(value: number): unknown {
    return [new ByteValue(value)];
  }
}

export class PinValue extends ValueAbstract {
  readonly type = ValueType.Pin;
  constructor(readonly value: number) {
    super();
  }

  static create(value: number): unknown {
    return [new PinValue(value)];
  }
}

export class IntegerValue extends ValueAbstract {
  readonly type = ValueType.Integer;
  constructor(readonly value: number) {
    super();
  }

  static create(value: number): unknown {
    return [new IntegerValue(value), 0, 0, 0];
  }
}

export class SignedIntegerValue extends ValueAbstract {
  readonly type = ValueType.SignedInteger;
  constructor(readonly value: number) {
    super();
  }

  static create(value: number): unknown {
    return [new SignedIntegerValue(value), 0, 0, 0];
  }
}

export class AddressValue extends ValueAbstract {
  readonly type = ValueType.Address;
  constructor(readonly value: number[]) {
    super();
  }

  static create(value: number[]): unknown {
    return [new AddressValue(value), 0, 0, 0];
  }
}

export class StringValue extends ValueAbstract {
  readonly type = ValueType.String;
  constructor(readonly value: string[]) {
    super();
  }

  static create(value: string[]): unknown {
    return [new StringValue(value)].concat(Array(value.length).fill(0));
  }
}

type Value = IdentifierValue | ByteValue | PinValue | IntegerValue | SignedIntegerValue | AddressValue | StringValue;

export function isValue(subject: unknown): subject is Value {
  return subject instanceof ValueAbstract;
}

export function serializeValue(value: Value): number[] {
  return [value.type].concat(valueToByteArray(value));
}

function valueToByteArray(type: Value): number[] {
  switch (type.type) {
    case ValueType.Address:
      return numberToInt32(bytesToNumber(type.value));

    case ValueType.Integer:
    case ValueType.SignedInteger:
      return numberToInt32(type.value);

    case ValueType.Byte:
    case ValueType.Pin:
    case ValueType.Identifier:
      return [type.value];

    case ValueType.String:
      return stringToBytes(type.value);
  }
}
