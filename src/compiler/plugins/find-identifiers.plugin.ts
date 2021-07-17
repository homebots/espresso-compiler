import { CompilerPlugin, Context } from '../plugins';
import { isIdentifier } from '../types';

export interface ContextWithIdentifiers extends Context {
  identifiers: Map<string, number>;
}

export class FindIdentifiersPlugin<C extends Context> implements CompilerPlugin<ContextWithIdentifiers> {
  run(context: C): C & ContextWithIdentifiers {
    const identifiers = this.declareIdentifiers(context.bytes);

    return { ...context, identifiers };
  }

  private declareIdentifiers(nodes: unknown[]) {
    const identifiers = new Map<string, number>();

    nodes.forEach((item) => {
      if (!isIdentifier(item)) {
        return;
      }

      if (identifiers.size >= 0xff) {
        throw new Error('Too many identifiers');
      }

      if (!identifiers.has(item.name)) {
        item.id = identifiers.size;
        identifiers.set(item.name, identifiers.size);
        return;
      }
    });

    return identifiers;
  }
}
