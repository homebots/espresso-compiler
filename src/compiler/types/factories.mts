import { ValueType, extend, factories } from './nodes.mjs';

extend(factories, {
  nullValue(type) {
    return { type, value: 0, dataType: ValueType.Null };
  },
  identifierValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Identifier };
  },
  byteValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Byte };
  },
  pinValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Pin };
  },
  booleanValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Byte };
  },
  addressValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Address };
  },
  integerValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Integer };
  },
  signedIntegerValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.Integer };
  },
  stringValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.String };
  },

});
