import { OpCodes, binaryOperatorMap, unaryOperatorMap } from './constants';
import { charArrayToBytes, numberToInt32, numberToUnsignedInt32 } from './data-convertion';

interface NodeTypeToNodeMap {
  comment: InstructionNode;
  declareIdentifier: DeclareIdentifierNode;
  useIdentifier: UseIdentifierNode;
  defineLabel: LabelNode;

  // values
  label: LabelNode;
  value: ByteValueNode | NumberValueNode | StringValueNode;
  identifierValue: IdentifierValueNode;

  // io
  ioWrite: IoWriteNode;
  ioRead: IoReadNode;
  ioMode: IoModeNode;
  ioType: IoTypeNode;
  ioAllOut: InstructionNode;

  // system
  halt: InstructionNode;
  restart: InstructionNode;
  noop: InstructionNode;
  systemInfo: InstructionNode;
  dump: InstructionNode;
  debug: NodeWithSingleValue<ValueNode<number>>;
  print: NodeWithSingleValue<ValueNode>;
  delay: NodeWithSingleValue<ValueNode<number>>;
  sleep: NodeWithSingleValue<ValueNode<number>>;
  yield: NodeWithSingleValue<ValueNode<number>>;
  jumpTo: SystemJumpToNode;
  jumpIf: SystemJumpIfNode;

  // operators
  assign: AssignOperationNode;
  unaryOperation: UnaryOperationNode;
  binaryOperation: BinaryOperationNode;
  not: NotOperationNode;

  // memory
  memoryCopy: MemoryGetNode;
  memoryGet: MemoryGetNode;
  memorySet: MemorySetNode;
}

// type NodeFactory<T extends InstructionNode> = (properties?: T) => T;
// const factories: { [K in keyof NodeTypeToNodeMap]?: NodeFactory<NodeTypeToNodeMap[K]> } = {};

type NodeSerializer<T extends InstructionNode> = (node: T) => Array<number | InstructionNode>;
const serializers: { [K in keyof NodeTypeToNodeMap]?: NodeSerializer<NodeTypeToNodeMap[K]> } = {};

type NodeSizeOf<T extends InstructionNode> = (node: T) => number;
const sizeOf: { [K in keyof NodeTypeToNodeMap]?: NodeSizeOf<NodeTypeToNodeMap[K]> } = {};

export class InstructionNode {
  type: keyof NodeTypeToNodeMap;

  static serialize(node: InstructionNode): Array<number | InstructionNode> | null {
    return (serializers[node.type] as NodeSerializer<InstructionNode>)(node);
    // if (serializers[node.type]) {
    // }
    //   return null;
  }

  static sizeOf(node: InstructionNode): number {
    if (sizeOf[node.type]) {
      return (sizeOf[node.type] as NodeSizeOf<InstructionNode>)(node);
    }

    return 1;
  }

  static isOfType<K extends keyof NodeTypeToNodeMap>(item: InstructionNode, type: K): item is NodeTypeToNodeMap[K] {
    return Boolean(item && item.type === type);
  }

  static create<K extends keyof NodeTypeToNodeMap>(
    type: K,
    properties?: Omit<NodeTypeToNodeMap[K], 'type'>,
  ): NodeTypeToNodeMap[K] {
    properties = properties || ({} as NodeTypeToNodeMap[K]);

    // if (factories[type]) {
    //   const factory = factories[type];
    //   properties = factory(properties as never) as NodeTypeToNodeMap[K];
    // }

    return { ...properties, type } as NodeTypeToNodeMap[K];
  }
}

export enum ValueType {
  Null = 0,
  Identifier,
  Byte,
  Pin,
  Address,
  Integer,
  SignedInteger,
  String,
}

export interface NodeWithSingleValue<T> extends InstructionNode {
  value: T;
}

export type IdentifierType = ValueType.Byte | ValueType.Integer | ValueType.SignedInteger | ValueType.String;
type ValueNodePrimities = number | number[] | string[];

export interface DeclareIdentifierNode<T extends ValueNodePrimities = ValueNodePrimities> extends InstructionNode {
  dataType: IdentifierType;
  value: ValueNode<T>;
  name: string;
  id?: number;
}

export interface UseIdentifierNode extends InstructionNode {
  name: string;
  id?: number;
}

export interface ValueNode<T = ValueNodePrimities | UseIdentifierNode> extends InstructionNode {
  dataType: ValueType;
  value: T;
}

export type ByteValueNode = ValueNode<number>;
export type NumberValueNode = ValueNode<[number, number, number, number]>;
export type StringValueNode = ValueNode<string[]>;
export type IdentifierValueNode = ValueNode<UseIdentifierNode>;

export interface IoWriteNode extends InstructionNode {
  pin: number;
  value: ValueNode;
}

export interface IoModeNode extends InstructionNode {
  pin: number;
  mode: number;
}

export interface IoTypeNode extends InstructionNode {
  pin: number;
  pinType: number;
}

export interface IoReadNode extends InstructionNode {
  pin: number;
  target: number;
}

export interface LabelNode extends InstructionNode {
  label: string;
}

export interface SystemJumpToNode extends InstructionNode {
  address?: NumberValueNode;
  label?: LabelNode;
}

export interface SystemJumpIfNode extends SystemJumpToNode {
  condition: ValueNode;
}

export interface MemorySetNode extends InstructionNode {
  target: number;
  value: ValueNode;
}

export interface MemoryGetNode extends InstructionNode {
  target: number;
  address: ValueNode<number>;
}

export interface UnaryOperationNode extends InstructionNode {
  operator: string;
  target: ValueNode;
}

export interface BinaryOperationNode extends InstructionNode {
  operator: string;
  target: ValueNode;
  a: ValueNode;
  b: ValueNode;
}

export interface NotOperationNode extends InstructionNode {
  target: ValueNode<number>;
  value: ValueNode;
}

export interface AssignOperationNode extends InstructionNode {
  target: IdentifierValueNode;
  value: ValueNode;
}

//////
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
      return [type.value as number];

    case ValueType.String:
      return charArrayToBytes(type.value as unknown as string[]);
  }
}

export function serializeValue(value: ValueNode): number[] {
  return [value.dataType].concat(valueToByteArray(value));
}

Object.assign(serializers, <typeof serializers>{
  declareIdentifier: (node) => [OpCodes.Declare, node.id, ...serializeValue(node.value)],
  halt: () => [OpCodes.Halt],
  restart: () => [OpCodes.Restart],
  noop: () => [OpCodes.Noop],
  systemInfo: () => [OpCodes.SystemInfo],
  dump: () => [OpCodes.Dump],
  debug: (node) => [OpCodes.Debug, node.value],
  delay: (node) => [OpCodes.Delay, ...serializeValue(node.value)],
  print: (node) => [OpCodes.Print, ...serializeValue(node.value)],
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
  ioWrite: (node) => [OpCodes.IoWrite, node.pin, ...serializeValue(node.value)],
});

Object.assign(sizeOf, <typeof sizeOf>{
  // comment: () => 0,
  declareIdentifier: (node) => 2 + serializeValue(node.value).length,
  // useIdentifier: () => 1,
  // defineLabel: () => 0,

  // values
  // label: () => 0,
  // value: (node) => serializeValue(node).length,

  // io
  ioWrite: (node) => 2 + serializeValue(node.value).length,
  // ioRead: () => 1,
  // ioMode: () => 1,
  // ioType: () => 1,

  // system
  systemInfo: () => 1,
  debug: () => 1,
  print: () => 1,
  delay: () => 1,
  sleep: () => 1,
  yield: () => 1,
  jumpTo: () => 6,
  jumpIf: (node) => 6 + serializeValue(node.condition).length,

  // operators
  assign: (node) => 1 + serializeValue(node.target).length + serializeValue(node.value).length,
  unaryOperation: (node) => 1 + serializeValue(node.target).length,
  binaryOperation: () => 1,
  not: () => 1,

  // memory
  // memoryCopy: () => 1,
  // memoryGet: () => 1,
  // memorySet: () => 1,
});
