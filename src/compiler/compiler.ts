import { Reference, Placeholder, isReference, isPlaceholder, numberToInt32, isValue, serializeValue } from './types';
import parser from './parser';

type Nodes = Array<Reference | Placeholder | number>;

interface ParseError {
  location: { start: { line: number; column: number } };
  message: string;
}

export class Compiler {
  private parser = parser();

  parse(code: string): Nodes {
    return this.parser.parse(code);
  }

  compile(code: string): number[] {
    code = code.trim();

    if (!code) {
      return [];
    }

    try {
      const nodes = this.parse(code).flat(2);
      const bytes = this.replaceNodes(nodes);

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

  replaceNodes(nodes: Nodes): Array<number> {
    const references = new Map();
    // const identifiers = new Map();
    // this.tagIdentifiers(nodes, identifiers);

    nodes = this.filterReferences(nodes, references);
    nodes = this.replaceValues(nodes);
    nodes = this.replacePlaceholders(nodes, references);
    // nodes = this.replaceIdentifiers(nodes);

    return nodes as number[];
  }

  private filterReferences(nodes: Nodes, references: Map<string, number>) {
    return nodes.filter((item, index) => {
      if (isReference(item)) {
        references.set(item.name, index - references.size);
        return false;
      }

      return true;
    });
  }

  // private tagIdentifiers(nodes: Nodes, identifiers: Map<string, number>) {
  //   return nodes.forEach((item) => {
  //     if (!isIdentifier(item)) return;

  //     if (!identifiers.has(item.name)) {
  //       item.id = identifiers.size;
  //       identifiers.set(item.name, identifiers.size);
  //       return;
  //     }

  //     item.id = identifiers.get(item.name);
  //   });
  // }

  // private replaceIdentifiers(nodes: Nodes) {
  //   return nodes.map((node) => {
  //     if (isIdentifier(node)) {
  //       return node.id;
  //     }

  //     return node;
  //   });
  // }

  private replacePlaceholders(nodes: Nodes, references: Map<string, number>) {
    const output = [];

    for (let index = 0; index < nodes.length; ) {
      const node = nodes[index];

      if (isPlaceholder(node)) {
        output.push(...numberToInt32(references.get(node.name)));
        index += 4;
        continue;
      }

      output.push(node);
      index++;
    }

    return output;
  }

  private replaceValues(nodes: Nodes) {
    const output = [];

    for (let index = 0; index < nodes.length; ) {
      const node = nodes[index];

      if (isValue(node)) {
        const value = serializeValue(node);

        output.push(...value);
        index += value.length - 1;
        continue;
      }

      output.push(node);
      index++;
    }

    return output;
  }
}
