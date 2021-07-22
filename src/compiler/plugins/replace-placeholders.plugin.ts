import { numberToInt32 } from '../types/data-convertion';
import { isPlaceholder } from '../references';
import { ContextWithReferences } from './remove-references.plugin';
import { CompilerPlugin } from '../compiler';

export class ReplacePlaceholdersPlugin implements CompilerPlugin<ContextWithReferences, ContextWithReferences> {
  run(context: ContextWithReferences): ContextWithReferences {
    const { bytes, references } = context;
    const output = [];

    for (let index = 0; index < bytes.length; ) {
      const node = bytes[index];

      if (isPlaceholder(node)) {
        output.push(...numberToInt32(references.get(node.name)));
        index += 4;
        continue;
      }

      output.push(node);
      index++;
    }

    return { ...context, bytes: output };
  }
}
