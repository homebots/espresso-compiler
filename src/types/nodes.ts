export interface NodeTypeToNodeMap {
  comment: InstructionNode;

  // values
  declareIdentifier: DeclareIdentifierNode;
  useIdentifier: UseIdentifierNode;
  defineLabel: LabelNode;
  label: LabelNode;

  byteValue: ByteValueNode;
  numberValue: NumberValueNode;
  stringValue: StringValueNode;
  identifierValue: IdentifierValueNode;

  // functions
  function: FunctionNode;
  call: FunctionCallNode;

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
  print: PrintNode;
  debug: NodeWithSingleValue<number>;
  delay: NodeWithSingleValue<ValueNode<number>>;
  sleep: NodeWithSingleValue<ValueNode<number>>;
  yield: NodeWithSingleValue<ValueNode<number>>;
  jumpTo: SystemJumpToNode;
  jumpIf: SystemJumpIfNode;

  // io
  ioWrite: IoWriteNode;
  ioRead: IoReadNode;
  ioMode: IoModeNode;
  ioType: IoTypeNode;
  ioAllOut: InstructionNode;

  // memory
  memoryCopy: MemoryCopyNode;
  memoryGet: MemoryGetNode;
  memorySet: MemorySetNode;
}

// type NodeFactory<T extends InstructionNode> = (properties?: T) => T;
// const factories: { [K in keyof NodeTypeToNodeMap]?: NodeFactory<NodeTypeToNodeMap[K]> } = {};

export class InstructionNode {
  type: keyof NodeTypeToNodeMap;

  static isOfType<K extends keyof NodeTypeToNodeMap>(item: InstructionNode, type: K): item is NodeTypeToNodeMap[K] {
    return Boolean(item && item.type === type);
  }

  static create<K extends keyof NodeTypeToNodeMap>(
    type: K,
    properties?: Omit<NodeTypeToNodeMap[K], 'type'>,
  ): NodeTypeToNodeMap[K] {
    properties = properties || ({} as NodeTypeToNodeMap[K]);

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

export interface PrintNode extends InstructionNode {
  values: ValueNode<ValueNodePrimities>[];
}

export type IdentifierType = ValueType.Byte | ValueType.Integer | ValueType.SignedInteger | ValueType.String;
export type ValueNodePrimities = number | string[];

export interface DeclareIdentifierNode<T extends ValueNodePrimities = ValueNodePrimities> extends InstructionNode {
  dataType: IdentifierType;
  value: ValueNode<T>;
  name: string;
  id?: number;
}

export interface FunctionNode extends InstructionNode {
  dataType: IdentifierType;
  name: string;
  args: FunctionArgumentNode[];
  id?: number;
}

export interface FunctionCallNode extends InstructionNode {
  name: string;
  inputs: FunctionArgumentNode[];
}

export interface FunctionArgumentNode {
  dataType: IdentifierType;
  name: string;
  value?: ValueNode;
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
export type NumberValueNode = ValueNode<number>;
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

export interface MemoryCopyNode extends InstructionNode {
  destination: NumberValueNode;
  source: NumberValueNode;
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
