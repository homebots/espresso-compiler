import { ByteArray, CompilationContext, CompilerPlugin } from '../compiler.mjs';
import { InstructionNode } from '../types/index.mjs';

export class SerializePlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const bytes = context.nodes
      .flatMap((node) => InstructionNode.serialize(node))
      .filter((byte) => byte !== null) as ByteArray;

    return {
      ...context,
      bytes,
    };
  }
}
