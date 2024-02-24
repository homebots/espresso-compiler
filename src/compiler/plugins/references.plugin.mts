import { CompilationContext, CompilerPlugin } from '../compiler.mjs';
import { InstructionNode } from '../types/index.mjs';

export class MapFunctionLocationsPlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const { functionMap } = context;
    let byteAccumulator = 0;

    context.nodes.forEach((node) => {
      if (InstructionNode.isOfType(node, 'define')) {
        // if (functionMap.has(node.label)) {
        //   throw new Error(`Cannot redeclare function ${node.label}`);
        // }

        functionMap.set(node.label, byteAccumulator);
      }

      byteAccumulator += InstructionNode.sizeOf(node);
    });

    return {
      ...context,
      functionMap,
    };
  }
}

export class AlignFunctionCallsPlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    context.nodes.forEach((node) => {
      if (
        InstructionNode.isOfType(node, 'jumpTo') ||
        InstructionNode.isOfType(node, 'jumpIf') ||
        InstructionNode.isOfType(node, 'ioInterrupt')
        ) {
        const { label } = node;

        // if (!context.functionMap.has(label)) {
        //   throw new Error(`Function ${label} not found`);
        // }

        const address = context.functionMap.get(label);
        node.address = InstructionNode.create('addressValue', { value: address });
      }
    });

    return context;
  }
}
