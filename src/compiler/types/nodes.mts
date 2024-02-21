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

export interface NodeTypeToNodeMap {
  comment: InstructionNode;

  // values
  declareIdentifier: DeclareIdentifierNode;
  useIdentifier: UseIdentifierNode;
  defineLabel: LabelNode;
  label: LabelNode;

  nullValue: NullValueNode;
  identifierValue: IdentifierValueNode;
  byteValue: ByteValueNode;
  pinValue: ByteValueNode;
  addressValue: NumberValueNode;
  integerValue: NumberValueNode;
  signedIntegerValue: NumberValueNode;
  stringValue: StringValueNode;
  booleanValue: StringValueNode;

  // operators
  assign: AssignOperationNode;
  unaryOperation: UnaryOperationNode;
  binaryOperation: BinaryOperationNode;
  not: NotOperationNode;

  // system
  halt: InstructionNode;
  restart: InstructionNode;
  noop: InstructionNode;
  systemInfo: InstructionNode;
  dump: InstructionNode;
  print: NodeWithSingleValue<ValueNode<ValueNodePrimities>>;
  debug: NodeWithSingleValue<ValueNode<ValueNodePrimities>>;
  delay: NodeWithSingleValue<ValueNode<number>>;
  sleep: NodeWithSingleValue<ValueNode<number>>;
  yield: InstructionNode;
  jumpTo: SystemJumpToNode;
  jumpIf: SystemJumpIfNode;

  // io
  ioWrite: IoWriteNode;
  ioRead: IoReadNode;
  ioMode: IoModeNode;
  ioType: IoTypeNode;
  ioAllOutput: InstructionNode;

  // memory
  memoryGet: MemoryGetNode;
  memorySet: MemorySetNode;

  // wifi
  wifiConnect: WifiConnectNode;
  wifiDisconnect: InstructionNode;
}

type NodeFactory<T extends InstructionNode> = (type: T['type'], properties?: T) => T;
export const factories: { [K in keyof NodeTypeToNodeMap]?: NodeFactory<NodeTypeToNodeMap[K]> } = {};

type NodeSerializer<T extends InstructionNode> = (node: T) => Array<number | InstructionNode>;
export const serializers: { [K in keyof NodeTypeToNodeMap]?: NodeSerializer<NodeTypeToNodeMap[K]> } = {};

type NodeSizeOf<T extends InstructionNode> = (node: T) => number;
export const sizeOf: { [K in keyof NodeTypeToNodeMap]?: NodeSizeOf<NodeTypeToNodeMap[K]> } = {};

export function extend<A>(target: A, properties: Partial<A>) {
  return Object.assign(target, properties);
}

export class InstructionNode {
  type: keyof NodeTypeToNodeMap;

  static serialize(node: InstructionNode): Array<number | InstructionNode> | null {
    return (serializers[node.type] as NodeSerializer<InstructionNode>)(node);
  }

  static sizeOf(node: InstructionNode): number {
    return (sizeOf[node.type] as NodeSizeOf<InstructionNode>)(node);
  }

  static isOfType<K extends keyof NodeTypeToNodeMap>(item: InstructionNode, type: K): item is NodeTypeToNodeMap[K] {
    return Boolean(item && item.type === type);
  }

  static create<K extends keyof NodeTypeToNodeMap>(
    type: K,
    properties?: Partial<Omit<NodeTypeToNodeMap[K], 'type'>>,
  ): NodeTypeToNodeMap[K] {
    properties ||= ({} as NodeTypeToNodeMap[K]);

    if (factories[type]) {
      const factory = factories[type];
      properties = factory(type, properties as never) as NodeTypeToNodeMap[K];
    }

    return { ...properties, type } as NodeTypeToNodeMap[K];
  }
}

export interface NodeWithSingleValue<T> extends InstructionNode {
  value: T;
}

export type IdentifierType = ValueType.Byte | ValueType.Integer | ValueType.SignedInteger | ValueType.String;
export type ValueNodePrimities = number | string | string[];

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

export interface NullValueNode extends InstructionNode {
  dataType: ValueType.Null;
  value: 0;
}

export type ByteValueNode = ValueNode<number>;
export type NumberValueNode = ValueNode<number>;
export type StringValueNode = ValueNode<string>;
export type IdentifierValueNode = ValueNode<UseIdentifierNode>;

export interface IoWriteNode extends InstructionNode {
  pin: ByteValueNode;
  value: ValueNode;
}

export interface IoModeNode extends InstructionNode {
  pin: ByteValueNode;
  mode: ByteValueNode;
}

export interface IoTypeNode extends InstructionNode {
  pin: ByteValueNode;
  pinType: ByteValueNode;
}

export interface IoReadNode extends InstructionNode {
  pin: ByteValueNode;
  target: IdentifierValueNode;
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
  target: NumberValueNode;
  value: ValueNode;
}

export interface MemoryGetNode extends InstructionNode {
  target: IdentifierValueNode;
  address: NumberValueNode;
}

export interface UnaryOperationNode extends InstructionNode {
  operator: 'inc' | 'dec';
  target: IdentifierValueNode;
}

export interface BinaryOperationNode extends InstructionNode {
  operator: string;
  target: IdentifierValueNode;
  a: ValueNode;
  b: ValueNode;
}

export interface NotOperationNode extends InstructionNode {
  target: IdentifierValueNode;
  value: ValueNode;
}

export interface AssignOperationNode extends InstructionNode {
  target: IdentifierValueNode;
  value: ValueNode;
}

export interface WifiConnectNode extends InstructionNode {
  ssid: StringValueNode;
  password: StringValueNode | NullValueNode;
}
