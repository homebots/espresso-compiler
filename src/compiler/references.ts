const OBJECT = 'object';

export class Reference {
  readonly type = 'reference';
  constructor(readonly name: string) {}

  static create(name: string): Reference {
    return new Reference(name);
  }
}

export class Placeholder {
  readonly type = 'placeholder';
  constructor(readonly name: string) {}

  static create(name: string): Placeholder {
    return new Placeholder(name);
  }
}

export function isReference(item: unknown): item is Reference {
  return Boolean(item && typeof item === OBJECT && (item as Reference).type === 'reference');
}

export function isPlaceholder(item: unknown): item is Placeholder {
  return Boolean(item && typeof item === OBJECT && (item as Placeholder).type === 'placeholder');
}
