export * from './values';
export * from './references';
export * from './data-convertion';

export class DeclareIdentifier {
  constructor(readonly name: string) {}

  static create(name: string): unknown {
    return [new DeclareIdentifier(name)];
  }
}

export function isIdentifier(item: unknown): item is DeclareIdentifier {
  return Boolean(item && item instanceof DeclareIdentifier);
}
