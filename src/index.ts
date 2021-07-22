import { Compiler, defaultPlugins } from './compiler';
import { ByteArray } from './compiler/compiler';

export * from './compiler';
export * from './emulator';

export function compile(source: string): ByteArray {
  return new Compiler().compile(source, defaultPlugins);
}
