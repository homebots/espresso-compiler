import { IdentifierType, ValueType } from './values';

export * from './values';
export * from './references';
export * from './data-convertion';

export class DeclareIdentifier {
  id = 0;
  constructor(readonly type: IdentifierType, readonly name: string) {}

  static createByte(name: string): unknown {
    return [new DeclareIdentifier(ValueType.Byte, name)];
  }

  static createString(name: string): unknown {
    return [new DeclareIdentifier(ValueType.String, name)];
  }

  static createInteger(name: string): unknown {
    return [new DeclareIdentifier(ValueType.Integer, name)];
  }
}

export function isIdentifier(item: unknown): item is DeclareIdentifier {
  return Boolean(item && item instanceof DeclareIdentifier);
}
