const OBJECT = 'object';
const MAX_INTEGER = 4294967295;

export interface Node {
  type: string;
}

export interface NamedNode<T extends string> extends Node {
  type: T;
  name: string;
}

export type Reference = NamedNode<'reference'>;
export type Placeholder = NamedNode<'placeholder'>;

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

export function isReference(item: unknown): item is Reference {
  return Boolean(item && typeof item === OBJECT && (item as Node).type === 'reference');
}

export function isPlaceholder(item: unknown): item is Placeholder {
  return Boolean(item && typeof item === OBJECT && (item as Node).type === 'placeholder');
}

export class DeclareIdentifier {
  constructor(readonly name: string) {}

  static create(name: string): unknown {
    return [new DeclareIdentifier(name)];
  }
}

export function isIdentifier(item: unknown): item is DeclareIdentifier {
  return Boolean(item && item instanceof DeclareIdentifier);
}

export function numberToInt32(number: number): number[] {
  if (number > MAX_INTEGER) {
    throw new SyntaxError('number is too large');
  }

  return Array.from(new Uint8Array(new Uint32Array([number]).buffer));
}

export function bytesToNumber(int32bytes: number[]): number {
  return Array.from(new Uint32Array(new Uint8Array(int32bytes).buffer))[0];
}

export function stringToBytes(string: string[]): number[] {
  return string.map((c) => c.charCodeAt(0)).concat([0]);
}
