import { numberToInt32 } from './helpers';
import { Node, isReference, isPlaceholder, isIdentifier } from './types';
import * as helpers from './helpers';
import grammar from './grammar';

type Nodes = Array<Node | number>;

export class Compiler {
  private parser = grammar(helpers);

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

  handleError(error: any): void {
    if (error.location) {
      throw new SyntaxError(
        'At ' + error.location.start.line + ',' + error.location.start.column + ': ' + error.message,
      );
    }

    throw error;
  }

  replaceNodes(nodes: Nodes): Array<number> {
    const references = new Map();
    const identifiers = new Map();

    this.tagIdentifiers(nodes, identifiers);

    nodes = this.filterReferences(nodes, references);
    nodes = this.replacePlaceholders(nodes, references);
    nodes = this.replaceIdentifiers(nodes);

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

  private tagIdentifiers(nodes: Nodes, identifiers: Map<string, number>) {
    return nodes.forEach((item) => {
      if (!isIdentifier(item)) return;

      if (!identifiers.has(item.name)) {
        item.id = identifiers.size;
        identifiers.set(item.name, identifiers.size);
        return;
      }

      item.id = identifiers.get(item.name);
    });
  }

  private replaceIdentifiers(nodes: Nodes) {
    return nodes.map((node) => {
      if (isIdentifier(node)) {
        return node.id;
      }

      return node;
    });
  }

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

  // protected replaceNode<A, T>(
  //   nodes: Array<A>,
  //   type: { new (): T },
  //   replacer: (node: T, index: number) => number,
  // ): Array<A | number> {
  //   return nodes.map((node, index) => {
  //     if (typeof node === OBJECT && node instanceof type) {
  //       return replacer(node, index);
  //     }

  //     return node;
  //   });
  // }
}
