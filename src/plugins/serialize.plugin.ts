import { ByteArray, CompilationContext, CompilerPlugin } from '../compiler/index';
import {
  binaryOperatorMap,
  InstructionNode,
  NodeTypeToNodeMap,
  OpCodes,
  unaryOperatorMap,
  UseIdentifierNode,
  ValueNode,
  ValueType,
} from '../types/index';
import { charArrayToBytes, numberToInt32, numberToUnsignedInt32 } from '../utils/index';

type NodeSerializer<T extends InstructionNode> = (node: T) => Array<number | InstructionNode>;
const serializers: { [K in keyof NodeTypeToNodeMap]?: NodeSerializer<NodeTypeToNodeMap[K]> } = {};

type NodeSizeOf<T extends InstructionNode> = (node: T) => number;
const sizeOf: { [K in keyof NodeTypeToNodeMap]?: NodeSizeOf<NodeTypeToNodeMap[K]> } = {};

export class SerializePlugin implements CompilerPlugin {
  run(context: CompilationContext): CompilationContext {
    const bytes = context.nodes
      .map((node) => SerializePlugin.serialize(node))
      .flat()
      .filter((byte) => byte !== null) as ByteArray;

    return {
      ...context,
      bytes,
    };
  }

  static serialize(node: InstructionNode): Array<number | InstructionNode> | null {
    return (serializers[node.type] as NodeSerializer<InstructionNode>)(node);
  }

  static sizeOf(node: InstructionNode): number {
    return (sizeOf[node.type] as NodeSizeOf<InstructionNode>)(node);
  }
}

export function serializeValue(value: ValueNode): number[] {
  return [value.dataType].concat(valueToByteArray(value));
}

Object.assign(serializers, <typeof serializers>{
  comment: () => [],
  declareIdentifier: (node) => [OpCodes.Declare, node.id, ...serializeValue(node.value)],
  halt: () => [OpCodes.Halt],
  restart: () => [OpCodes.Restart],
  noop: () => [OpCodes.Noop],
  systemInfo: () => [OpCodes.SystemInfo],
  dump: () => [OpCodes.Dump],
  debug: (node) => [OpCodes.Debug, node.value],
  delay: (node) => [OpCodes.Delay, ...serializeValue(node.value)],
  print: (node) => node.values.map((v) => [OpCodes.Print, ...serializeValue(v)]).flat(2),
  sleep: (node) => [OpCodes.Sleep, ...serializeValue(node.value)],
  yield: (node) => [OpCodes.Yield, ...serializeValue(node.value)],
  assign: (node) => [OpCodes.Assign, ...serializeValue(node.target), ...serializeValue(node.value)],
  not: (node) => [OpCodes.Not, ...serializeValue(node.target), ...serializeValue(node.value)],
  unaryOperation: (node) => [unaryOperatorMap[node.operator], ...serializeValue(node.target)],
  binaryOperation: (node) => [
    binaryOperatorMap[node.operator],
    ...serializeValue(node.target),
    ...serializeValue(node.a),
    ...serializeValue(node.b),
  ],
  jumpTo: (node) => [OpCodes.JumpTo, ...serializeValue(node.address)],
  jumpIf: (node) => [OpCodes.JumpIf, ...serializeValue(node.condition), ...serializeValue(node.address)],
  ioMode: (node) => [OpCodes.IoMode, node.pin, node.mode],
  ioType: (node) => [OpCodes.IoType, node.pin, node.pinType],
  ioAllOut: () => [OpCodes.IoAllOut],
  ioWrite: (node) => [OpCodes.IoWrite, node.pin, ...serializeValue(node.value)],
  ioRead: (node) => [OpCodes.IoRead, node.pin, ...serializeValue(node.target)],
  memoryGet: (node) => [OpCodes.MemGet, ...serializeValue(node.target), ...serializeValue(node.address)],
  memorySet: (node) => [OpCodes.MemSet, ...serializeValue(node.target), ...serializeValue(node.value)],
  memoryCopy: (node) => [OpCodes.MemCopy, ...serializeValue(node.source), ...serializeValue(node.destination)],
});

Object.assign(sizeOf, <typeof sizeOf>{
  comment: () => 0,

  // values
  declareIdentifier: (node) => 2 + serializeValue(node.value).length,
  useIdentifier: () => 0,
  defineLabel: () => 0,
  label: () => 0,
  stringValue: (node) => serializeValue(node).length,
  byteValue: (node) => serializeValue(node).length,
  numberValue: (node) => serializeValue(node).length,
  identifierValue: (node) => serializeValue(node).length,

  // io
  ioWrite: (node) => 2 + serializeValue(node.value).length,
  ioRead: (node) => 2 + serializeValue(node.target).length,
  ioMode: () => 3,
  ioType: () => 3,
  ioAllOut: () => 1,

  // system
  halt: () => 1,
  restart: () => 1,
  noop: () => 1,
  systemInfo: () => 1,
  dump: () => 1,
  debug: () => 2,
  print: (node) => node.values.reduce((a, v) => a + 1 + serializeValue(v).length, 1),
  delay: (node) => 1 + serializeValue(node.value).length,
  sleep: (node) => 1 + serializeValue(node.value).length,
  yield: (node) => 1 + serializeValue(node.value).length,

  jumpTo: () => 6,
  jumpIf: (node) => 6 + serializeValue(node.condition).length,

  // operators
  assign: (node) => 1 + serializeValue(node.target).length + serializeValue(node.value).length,
  unaryOperation: (node) => 1 + serializeValue(node.target).length,
  binaryOperation: (node) =>
    1 + serializeValue(node.target).length + serializeValue(node.a).length + serializeValue(node.b).length,
  not: () => 1,

  // memory
  memoryGet: (node) => 1 + serializeValue(node.target).length + serializeValue(node.address).length,
  memorySet: (node) => 1 + serializeValue(node.target).length + serializeValue(node.value).length,
  memoryCopy: () => 11,
});

export function valueToByteArray(type: ValueNode): number[] {
  switch (type.dataType) {
    case ValueType.Address:
    case ValueType.Integer:
      return numberToUnsignedInt32(type.value as number);

    case ValueType.SignedInteger:
      return numberToInt32(type.value as number);

    case ValueType.Byte:
    case ValueType.Pin:
      return [type.value as number];

    case ValueType.Identifier:
      return [(type.value as UseIdentifierNode).id];

    case ValueType.String:
      return charArrayToBytes(type.value as unknown as string[]);
  }
}
