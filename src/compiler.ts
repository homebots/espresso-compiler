import * as peg from 'pegjs';
import { numberToInt32, Placeholder, Reference } from './helpers';

const NUMBER = 'number';

export class Compiler {
  constructor(private parser: peg.Parser) {}

  compile(code: string) {
    code = code.trim();

    if (!code) {
      return [];
    }

    try {
      const nodes = this.parse(code).flat(2);
      const bytes = this.replaceReferences(nodes);

      return bytes;
    } catch (error) {
      if (error.location) {
        throw new SyntaxError(
          'At ' + error.location.start.line + ',' + error.location.start.column + ': ' + error.message,
        );
      }

      throw error;
    }
  }

  parse(code: string) {
    return this.parser.parse(code);
  }

  replaceReferences<T>(input: Array<T | Reference | Placeholder>): T[] {
    const { nodesWithoutReferences, references } = this.filterOutReferences(input);
    const nodes = this.replacePlaceholders(nodesWithoutReferences, references);

    return nodes;
  }

  private filterOutReferences(nodes: any[]) {
    const references = new Map();
    const nodesWithoutReferences = [];
    const max = nodes.length;

    for (let index = 0; index < max; ) {
      const node = nodes[index];

      if (typeof node === NUMBER || node instanceof Placeholder) {
        nodesWithoutReferences.push(node);
        index++;
        continue;
      }

      if (node instanceof Reference) {
        references.set(node.name, index - references.size);
        index++;
        continue;
      }

      throw ReferenceError('Invalid token found at ' + index);
    }

    return { nodesWithoutReferences, references };
  }

  private replacePlaceholders(nodes: any[], references: Map<string, number>) {
    const output = [];

    for (let index = 0; index < nodes.length; ) {
      const node = nodes[index];

      if (typeof node === NUMBER) {
        output.push(node);
        index++;
        continue;
      }

      if (node instanceof Placeholder) {
        output.push(...numberToInt32(references.get(node.name)));
        index += 4;
        continue;
      }

      throw ReferenceError('Invalid token found at ' + index);
    }

    return output;
  }
}
