import { Compiler, ByteArray } from './compiler.js';
import { defaultPlugins } from './plugins.js';
export * from './types.js';
export { Compiler, CompilerPlugin, ByteArray, CompilationContext } from './compiler.js';
export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin } from './plugins.js';

export function compile(source: string): ByteArray {
  return new Compiler().compile(source || '', defaultPlugins);
}
