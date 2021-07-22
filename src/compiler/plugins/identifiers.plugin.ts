import { CompilationContext, CompilerPlugin } from '../compiler';
import { DeclareIdentifierNode, InstructionNode, ValueType } from '../types';

export interface ContextWithIdentifiers extends CompilationContext {
  identifiers: Map<string, number>;
  identifierTypes: Map<string, ValueType>;
}

export class FindIdentifiersPlugin<C extends CompilationContext> implements CompilerPlugin<ContextWithIdentifiers> {
  run(context: C): C & ContextWithIdentifiers {
    const { identifiers, identifierTypes } = this.declareIdentifiers(context.nodes);

    return { ...context, identifiers, identifierTypes };
  }

  private declareIdentifiers(nodes: InstructionNode[]) {
    const identifiers = new Map<string, number>();
    const identifierTypes = new Map<string, ValueType>();

    nodes.forEach((node) => {
      if (InstructionNode.isOfType(node, 'declareIdentifier')) {
        this.declareIdentifier(identifiers, identifierTypes, node);
        return;
      }
    });

    return { identifiers, identifierTypes };
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
    context.nodes.forEach((node) => {
      if (InstructionNode.isOfType(node, 'declareIdentifier')) {
        // node.bytes = [node.id];
      }
    });

    return context;
  }
}
