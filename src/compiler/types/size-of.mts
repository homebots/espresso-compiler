import { extend, sizeOf } from './nodes.mjs';
import { serializeValue } from './serializers.mjs';

const oneByte = () => 1;
const valueLength = (node) => serializeValue(node).length;

extend(sizeOf, {
  comment: () => 0,

  // values
  declareIdentifier: (node) => 2 + serializeValue(node.value).length,
  useIdentifier: () => 0,
  define: () => 1,
  label: () => 0,

  nullValue: valueLength,
  identifierValue: valueLength,
  byteValue: valueLength,
  pinValue: valueLength,
  addressValue: valueLength,
  integerValue: valueLength,
  signedIntegerValue: valueLength,
  stringValue: valueLength,
  booleanValue: valueLength,

  // io
  ioWrite: (node) => 1 + serializeValue(node.pin).length + serializeValue(node.value).length,
  ioRead: (node) => 1 + serializeValue(node.pin).length + serializeValue(node.target).length,
  ioMode: (node) => 1 + serializeValue(node.pin).length + serializeValue(node.mode).length,
  ioType: (node) => 1 + serializeValue(node.pin).length + serializeValue(node.pinType).length,
  ioInterrupt: (node) => 1 + serializeValue(node.pin).length + serializeValue(node.value).length + serializeValue(node.address).length,
  ioAllOutput: oneByte,
  ioAllInput: oneByte,

  // system
  halt: oneByte,
  restart: oneByte,
  noop: oneByte,
  systemInfo: oneByte,
  dump: oneByte,
  debug: (node) => 1 + serializeValue(node.value).length,
  print: (node) => 1 + serializeValue(node.value).length,
  delay: (node) => 1 + serializeValue(node.value).length,
  sleep: (node) => 1 + serializeValue(node.value).length,
  yield: oneByte,

  return: () => 1,
  jumpTo: () => 6,
  jumpIf: (node) => 6 + serializeValue(node.condition).length,

  // operators
  assign: (node) => 1 + serializeValue(node.target).length + serializeValue(node.value).length,
  unaryOperation: (node) => 1 + serializeValue(node.target).length,
  binaryOperation: (node) =>
    1 + serializeValue(node.target).length + serializeValue(node.a).length + serializeValue(node.b).length,
  not: oneByte,

  // memory
  memoryGet: (node) => 1 + serializeValue(node.target).length + serializeValue(node.address).length,
  memorySet: (node) => 1 + serializeValue(node.target).length + serializeValue(node.value).length,
  wifiConnect: (node) => 1 + serializeValue(node.ssid).length + serializeValue(node.password).length,
  wifiDisconnect: () => 1,
});
