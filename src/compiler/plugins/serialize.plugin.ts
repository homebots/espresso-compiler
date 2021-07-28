import { ByteArray, CompilationContext, CompilerPlugin } from '../compiler';
import { InstructionNode } from '../types';

export class SerializePlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const bytes = context.nodes
      .map((node) => InstructionNode.serialize(node))
      .flat()
      .filter((byte) => byte !== null) as ByteArray;

    return {
      ...context,
      bytes,
    };
  }
}
