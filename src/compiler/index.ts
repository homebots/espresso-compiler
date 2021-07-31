import { Compiler, ByteArray } from './compiler';
import { defaultPlugins, CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin } from './plugins';

export * from './types';
export { Compiler, CompilerPlugin, ByteArray, CompilationContext } from './compiler';

export { CheckTypesPlugin, FindIdentifiersPlugin, FindLabelsPlugin, SerializePlugin };

export function compile(source: string): ByteArray {
  return new Compiler().compile(source || '', defaultPlugins);
}
