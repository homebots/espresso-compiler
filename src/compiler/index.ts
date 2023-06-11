import { Compiler, ByteArray } from './compiler.js';
import { defaultPlugins } from './plugins/index.js';
export * from './types/index.js';
export { Compiler, CompilerPlugin, ByteArray, CompilationContext } from './compiler.js';
export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin } from './plugins/index.js';

export function compile(source: string): ByteArray {
  return new Compiler().compile(source || '', defaultPlugins);
}
