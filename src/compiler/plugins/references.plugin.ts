import { CompilationContext, CompilerPlugin } from '../compiler';
import { InstructionNode, numberToInt32, SystemJumpToNode, ValueType } from '../types';

export interface ContextWithLabels extends CompilationContext {
  labelAddresses?: Map<string, number>;
}

export class FindLabelsPlugin implements CompilerPlugin<ContextWithLabels> {
  run(context: CompilationContext): ContextWithLabels {
    const labelAddresses = new Map<string, number>();

    const nodes = context.nodes.filter((node, index) => {
      if (InstructionNode.isOfType(node, 'defineLabel')) {
        // add 4 bytes for int32, remove 1 for filtered out label
        const position = index - labelAddresses.size + labelAddresses.size * 4;
        labelAddresses.set(node.label, position);
        return false;
      }

      return true;
    });

    return {
      ...context,
      labelAddresses,
      nodes,
    };
  }
}

export class ReplaceLabelReferencesPlugin implements CompilerPlugin {
  run(context: ContextWithLabels): ContextWithLabels {
    const bytes = [];
    const length = context.bytes.length;

    for (let i = 0; i < length; ) {
      const byte = context.bytes[i];

      if (
        typeof byte === 'object' &&
        (InstructionNode.isOfType(byte, 'jumpTo') || InstructionNode.isOfType(byte, 'jumpIf'))
      ) {
        const node = byte as SystemJumpToNode;
        const address = context.labelAddresses.get(node.label.label);

        bytes.push(ValueType.Address, ...numberToInt32(address));
        i += 5;

        continue;
      }

      bytes.push(byte);
      i++;
    }

    return {
      ...context,
      bytes,
    };
  }
}
