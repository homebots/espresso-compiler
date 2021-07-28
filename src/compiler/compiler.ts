import parser from './parser';
import { InstructionNode } from './types';

export type ByteArray = Array<number>;

export interface CompilationContext {
  nodes: InstructionNode[];
  bytes: ByteArray;
}

export interface CompilerPlugin<
  OutputContext extends CompilationContext = CompilationContext,
  InputContext extends CompilationContext = CompilationContext,
> {
  run(context: InputContext): OutputContext;
}

interface ParseError {
  location: { start: { line: number; column: number } };
  message: string;
}

export class Compiler {
  private parser = parser();

  parse(code: string): Array<InstructionNode> {
    return this.parser.parse(code).flat(2);
  }

  compile<P extends CompilerPlugin[]>(code: string, plugins?: P): ByteArray {
    code = code.trim();

    if (!code) {
      return [];
    }

    try {
      const nodes = this.parse(code);
      const bytes = this.runPlugins(nodes, plugins);

      return bytes;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError<T>(error: ParseError | T): void {
    if ('location' in error) {
      throw new SyntaxError(
        'At ' + error.location.start.line + ',' + error.location.start.column + ': ' + error.message,
      );
    }

    throw error;
  }

  protected runPlugins<P extends CompilerPlugin[]>(nodes: Array<InstructionNode>, plugins: P): ByteArray {
    const initialContext: CompilationContext = { bytes: [], nodes };
    const context = plugins.reduce((context, plugin) => plugin.run(context), initialContext);

    // console.log(context.nodes);
    // console.log(context.bytes);

    return context.bytes as ByteArray;
  }
}
