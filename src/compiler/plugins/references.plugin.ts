import { CompilationContext, CompilerPlugin } from '../compiler';

export interface ContextWithReferences extends CompilationContext {
  references?: Map<string, number>;
}

export class ExtractReferencesPlugin implements CompilerPlugin<ContextWithReferences> {
  run(context: CompilationContext): ContextWithReferences {
    // const references = new Map<string, number>();

    // const bytes = context.bytes.filter((item, index) => {
    //   if (isReference(item)) {
    //     references.set(item.name, index - references.size);
    //     return false;
    //   }

    //   return true;
    // });

    // return {
    //   ...context,
    //   references,
    //   bytes,
    // };
    return context;
  }
}

export class ReplacePlaceholdersPlugin implements CompilerPlugin<ContextWithReferences, ContextWithReferences> {
  run(context: ContextWithReferences): ContextWithReferences {
    // const { bytes, references } = context;
    // const output = [];

    // for (let index = 0; index < bytes.length; ) {
    //   const node = bytes[index];

    //   if (isPlaceholder(node)) {
    //     output.push(...numberToInt32(references.get(node.name)));
    //     index += 4;
    //     continue;
    //   }

    //   output.push(node);
    //   index++;
    // }

    // return { ...context, bytes: output };
    return context;
  }
}
