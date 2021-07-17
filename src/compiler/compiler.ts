import parser from './parser';
import { ByteArray, CompilerPlugin, Context } from './plugins';
import { FindIdentifiersPlugin } from './plugins/find-identifiers.plugin';
import { ExtractReferencesPlugin } from './plugins/remove-references.plugin';
import { ReplaceIdentifiersPlugin } from './plugins/replace-identifiers.plugin';
import { ReplacePlaceholdersPlugin } from './plugins/replace-placeholders.plugin';
import { ReplaceValuesPlugin } from './plugins/replace-values.plugin';

export const defaultPlugins: CompilerPlugin[] = [
  new FindIdentifiersPlugin(),
  new ExtractReferencesPlugin(),
  new ReplaceIdentifiersPlugin(),
  new ReplacePlaceholdersPlugin(),
  new ReplaceValuesPlugin(),
];

interface ParseError {
  location: { start: { line: number; column: number } };
  message: string;
}

export class Compiler {
  private parser = parser();

  parse(code: string): Array<unknown> {
    return this.parser.parse(code).flat(2);
  }

  compile<P extends CompilerPlugin[]>(code: string, plugins?: P): ByteArray {
    code = code.trim();

    if (!code) {
      return [];
    }

    try {
      const nodes = this.parse(code);
      const bytes = this.replaceNodes(nodes, plugins || defaultPlugins);

      return bytes;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError<T>(error: ParseError | T): void {
    if ('location' in error) {
      throw new SyntaxError(
        'At ' + error.location.start.line + ',' + error.location.start.column + ': ' + error.message,
      );
    }

    throw error;
  }

  replaceNodes<P extends CompilerPlugin[]>(nodes: Array<unknown>, plugins: P): ByteArray {
    const initialContext: Context = { bytes: nodes as ByteArray };
    const context = plugins.reduce((context, plugin) => plugin.run(context), initialContext);

    return context.bytes;
  }
}
