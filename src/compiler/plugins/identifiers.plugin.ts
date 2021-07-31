import { CompilationContext, CompilerPlugin } from '../compiler';
import { DeclareIdentifierNode, InstructionNode, ValueType } from '../types';

export class FindIdentifiersPlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const { nodes, identifiers, identifierTypes } = context;

    nodes.forEach((node) => {
      if (InstructionNode.isOfType(node, 'declareIdentifier')) {
        this.declareIdentifier(identifiers, identifierTypes, node);
      }
    });

    return context;
  }

  private declareIdentifier(
    identifiers: Map<string, number>,
    identifierTypes: Map<string, ValueType>,
    node: DeclareIdentifierNode,
  ) {
    if (identifiers.size >= 0xff) {
      throw new Error('Too many identifiers');
    }

    if (!identifiers.has(node.name)) {
      node.id = identifiers.size;
      identifiers.set(node.name, identifiers.size);
      identifierTypes.set(node.name, node.dataType);
      return;
    }

    throw new Error('Cannot redeclare identifier: ' + node.name);
  }
}

export class ReplaceIdentifiersPlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const bytes = context.bytes.map((byte) => {
      const node = byte as unknown as InstructionNode;

      if (node && typeof node === 'object' && InstructionNode.isOfType(node, 'useIdentifier')) {
        return context.identifiers.get(node.name);
      }

      return byte;
    });

    return { ...context, bytes };
  }
}
