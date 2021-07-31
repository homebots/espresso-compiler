import { CompilationContext, CompilerPlugin } from '../compiler';
import { InstructionNode, ValueType } from '../types';

export class CheckTypesPlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    context.nodes.forEach((node) => {
      if (InstructionNode.isOfType(node, 'declareIdentifier') && node.dataType !== node.value.dataType) {
        throw new Error(
          `Invalid value. Expected ${ValueType[node.dataType]} but found ${ValueType[node.value.dataType]}`,
        );
      }

      if (InstructionNode.isOfType(node, 'assign')) {
        const targetName = node.target.value.name;
        const targetType = context.identifierTypes.get(targetName);

        if (targetType !== node.value.dataType) {
          throw new Error(
            `Invalid value for ${targetName}. Expected ${ValueType[targetType]} but found ${
              ValueType[node.value.dataType]
            }`,
          );
        }
      }
    });

    return context;
  }
}
