import { Compiler, ByteArray } from './compiler/compiler';
import { parse } from './parser/parser';
import { defaultPlugins } from './plugins/index';

export * from './compiler/index';
export { parse };

export {
  Emulator,
  Program,
  Clock,
  StepperClock,
  RealTimeClock,
  CaptureOutput,
  LogOutput,
  NullOutput,
  ProgramOutput,
} from './emulator/index';

export function compile(source: string): ByteArray {
  return new Compiler(parse).compile(source || '', defaultPlugins);
}
