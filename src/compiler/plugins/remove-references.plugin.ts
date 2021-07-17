import { CompilerPlugin, Context } from '../plugins';
import { isReference } from '../references';

export interface ContextWithReferences extends Context {
  references: Map<string, number>;
}

export class ExtractReferencesPlugin implements CompilerPlugin<ContextWithReferences> {
  run(context: Context): ContextWithReferences {
    const references = new Map<string, number>();

    const bytes = context.bytes.filter((item, index) => {
      if (isReference(item)) {
        references.set(item.name, index - references.size);
        return false;
      }

      return true;
    });

    return {
      ...context,
      references,
      bytes,
    };
  }
}
