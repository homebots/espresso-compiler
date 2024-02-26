import { extend, sizeOf } from './nodes.mjs';
import { serializeValue } from './serializers.mjs';

const empty = () => 0;
const valueLength = (node) => serializeValue(node).length;

extend(sizeOf, {
  comment: empty,
  useIdentifier: empty,
  label: empty,

  nullValue: valueLength,
  identifierValue: valueLength,
  byteValue: valueLength,
  pinValue: valueLength,
  addressValue: valueLength,
  integerValue: valueLength,
  signedIntegerValue: valueLength,
  stringValue: valueLength,
  booleanValue: valueLength,
});
