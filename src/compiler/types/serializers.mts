import { OpCodes, binaryOperatorMap, unaryOperatorMap, ValueType } from './constants.mjs';
import { InstructionNode, NullValueNode, UseIdentifierNode, ValueNode, extend, serializers } from './nodes.mjs';
import { charArrayToBytes, numberToInt32, numberToUnsignedInt32 } from './data-conversion.mjs';

export function valueToByteArray(type: ValueNode): number[] {
  switch (type.dataType) {
    case ValueType.Address:
    case ValueType.Integer:
      return numberToUnsignedInt32(type.value as number);

    case ValueType.SignedInteger:
      return numberToInt32(Number(type.value as number));

    case ValueType.Byte:
    case ValueType.Pin:
      return [type.value as number];

    case ValueType.Identifier:
      return [(type.value as UseIdentifierNode).id];

    case ValueType.String:
      return charArrayToBytes(Array.isArray(type.value) ? type.value : String(type.value).split(''));

    case ValueType.Null:
      return [0];
  }
}

export function serializeValue(value: ValueNode | NullValueNode): number[] {
  const v = valueToByteArray(value);
  return [value.dataType].concat(v);
}

extend(serializers, {
  comment: () => [],
  define: (node) => {
    const body = node.body.map((n) => InstructionNode.serialize(n as InstructionNode)).flat();
    const size = InstructionNode.create('integerValue', { value: body.length });

    return [OpCodes.Define, ...serializeValue(size), ...body];
  },
  declareIdentifier: (node) => [OpCodes.Declare, node.id, ...serializeValue(node.value)],
  halt: () => [OpCodes.Halt],
  restart: () => [OpCodes.Restart],
  noop: () => [OpCodes.Noop],
  systemInfo: () => [OpCodes.SystemInfo],
  dump: () => [OpCodes.Dump],
  debug: (node) => [OpCodes.Debug, ...serializeValue(node.value)],
  delay: (node) => [OpCodes.Delay, ...serializeValue(node.value)],
  print: (node) => [OpCodes.Print, ...serializeValue(node.value)],
  sleep: (node) => [OpCodes.Sleep, ...serializeValue(node.value)],
  yield: () => [OpCodes.Yield],
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
  return: () => [OpCodes.Return],
  ioMode: (node) => [OpCodes.IoMode, ...serializeValue(node.pin), ...serializeValue(node.mode)],
  ioType: (node) => [OpCodes.IoType, ...serializeValue(node.pin), ...serializeValue(node.pinType)],
  ioWrite: (node) => [OpCodes.IoWrite, ...serializeValue(node.pin), ...serializeValue(node.value)],
  ioRead: (node) => [OpCodes.IoRead, ...serializeValue(node.pin), ...serializeValue(node.target)],
  ioAllOutput: () => [OpCodes.IoAllOutput],
  ioAllInput: () => [OpCodes.IoAllInput],
  memoryGet: (node) => [OpCodes.MemGet, ...serializeValue(node.target), ...serializeValue(node.address)],
  memorySet: (node) => [OpCodes.MemSet, ...serializeValue(node.target), ...serializeValue(node.value)],
  wifiConnect: (node) => [OpCodes.WifiConnect, ...serializeValue(node.ssid), ...serializeValue(node.password)],
  wifiDisconnect: () => [OpCodes.WifiDisconnect],
  ioInterrupt: (node) => [
    OpCodes.Iointerrupt,
    ...serializeValue(node.pin),
    ...serializeValue(node.value),
    ...serializeValue(node.address),
  ],
  ioInterruptToggle: (node) => [OpCodes.IointerruptToggle, ...serializeValue(node.value)],
});
