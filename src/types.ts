const OBJECT = 'object';

export interface Node {
  type: string;
}

export interface NamedNode<T extends string> extends Node {
  type: T;
  name: string;
}

export type Reference = NamedNode<'reference'>;
export type Placeholder = NamedNode<'placeholder'>;

export interface Identifier extends NamedNode<'identifier'> {
  id: number;
}

export interface PinValue extends Node {
  type: 'pin';
  number: number;
}

export function isReference(item: unknown): item is Reference {
  return Boolean(item && typeof item === OBJECT && (item as Node).type === 'reference');
}

export function isPlaceholder(item: unknown): item is Placeholder {
  return Boolean(item && typeof item === OBJECT && (item as Node).type === 'placeholder');
}

export function isIdentifier(item: unknown): item is Identifier {
  return Boolean(item && typeof item === OBJECT && (item as Node).type === 'identifier');
}
