export * from './compiler/values';
export * from './compiler/references';
export * from './compiler/data-convertion';

export class DeclareIdentifier {
  constructor(readonly name: string) {}

  static create(name: string): unknown {
    return [new DeclareIdentifier(name)];
  }
}

export function isIdentifier(item: unknown): item is DeclareIdentifier {
  return Boolean(item && item instanceof DeclareIdentifier);
}
