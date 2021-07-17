import { CompilerPlugin } from '../plugins';
import { numberToInt32 } from '../data-convertion';
import { isPlaceholder } from '../references';
import { ContextWithReferences } from './remove-references.plugin';

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
