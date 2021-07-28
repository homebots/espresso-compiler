import { OpCodes } from './constants';
import { charArrayToBytes, numberToInt32, numberToUnsignedInt32 } from './data-convertion';

interface NodeTypeToNodeMap {
  comment: InstructionNode;
  declareIdentifier: DeclareIdentifierNode;
  useIdentifier: UseIdentifierNode;
  defineLabel: LabelNode;

  // values
  label: LabelNode;
  value: ByteValueNode | NumberValueNode | StringValueNode;

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
  placeholder: InstructionNode;

  // operators
  unaryOperation: UnaryOperationNode;
  binaryOperation: BinaryOperationNode;
  not: NotOperationNode;

  // memory
  memoryCopy: MemoryGetNode;
  memoryGet: MemoryGetNode;
  memorySet: MemorySetNode;
}

type NodeSerializer<T extends InstructionNode> = (node: T) => Array<number | InstructionNode>;
type NodeFactory<T extends InstructionNode> = (properties?: T) => T;

const factories: { [K in keyof NodeTypeToNodeMap]?: NodeFactory<NodeTypeToNodeMap[K]> } = {};
const serializers: { [K in keyof NodeTypeToNodeMap]?: NodeSerializer<NodeTypeToNodeMap[K]> } = {};

export class InstructionNode {
  type: keyof NodeTypeToNodeMap;

  static serialize(node: InstructionNode): Array<number | InstructionNode> | null {
    if (serializers[node.type]) {
      return (serializers[node.type] as NodeSerializer<InstructionNode>)(node);
    }

    return null;
  }

  static isOfType<K extends keyof NodeTypeToNodeMap>(item: InstructionNode, type: K): item is NodeTypeToNodeMap[K] {
    return Boolean(item && item.type === type);
  }

  static create<K extends keyof NodeTypeToNodeMap>(
    type: K,
    properties?: Omit<NodeTypeToNodeMap[K], 'type'>,
  ): NodeTypeToNodeMap[K] {
    properties = properties || ({} as NodeTypeToNodeMap[K]);

    if (factories[type]) {
      const factory = factories[type];
      properties = factory(properties as never) as NodeTypeToNodeMap[K];
    }

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

export interface ValueNode<T extends ValueNodePrimities = ValueNodePrimities> extends InstructionNode {
  dataType: ValueType;
  value: T;
}

export type ByteValueNode = ValueNode<number>;
export type NumberValueNode = ValueNode<[number, number, number, number]>;
export type StringValueNode = ValueNode<string[]>;

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

serializers.declareIdentifier = (node) => [OpCodes.Declare, node.id, node.dataType];
serializers.label = () => null;

serializers.halt = () => [OpCodes.Halt];
serializers.restart = () => [OpCodes.Restart];
serializers.noop = () => [OpCodes.Noop];
serializers.systemInfo = () => [OpCodes.SystemInfo];
serializers.dump = () => [OpCodes.Dump];
serializers.debug = (node) => [OpCodes.Debug, node.value];
serializers.delay = (node) => [OpCodes.Delay, ...serializeValue(node.value)];
serializers.print = (node) => [OpCodes.Print, ...serializeValue(node.value)];
serializers.sleep = (node) => [OpCodes.Sleep, ...serializeValue(node.value)];
serializers.yield = (node) => [OpCodes.Yield, ...serializeValue(node.value)];

serializers.jumpTo = (node) => [
  OpCodes.JumpTo,
  ...((node.address ? serializeValue(node.address) : [node, 0, 0, 0, 0]) as number[]),
];

serializers.jumpIf = (node) => [
  OpCodes.JumpIf,
  ...serializeValue(node.condition),
  ...((node.address ? serializeValue(node.address) : [node, 0, 0, 0, 0]) as number[]),
];

serializers.ioWrite = (node) => [OpCodes.IoWrite, node.pin, ...serializeValue(node.value)];

serializers.not = (node) => [OpCodes.Not, ...serializeValue(node.target), ...serializeValue(node.value)];
