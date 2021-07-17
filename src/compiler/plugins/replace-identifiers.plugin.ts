import { CompilerPlugin, Context } from '../plugins';
import { isIdentifier } from '../types';

export class ReplaceIdentifiersPlugin implements CompilerPlugin {
  run(context: Context): Context {
    const bytes = context.bytes.map((node) => {
      if (isIdentifier(node)) {
        return node.id;
      }

      return node;
    });

    return { ...context, bytes };
  }
}
