import { ValueType } from './constants.mjs';
import { extend, factories } from './nodes.mjs';

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
    return { type, value: properties.value, dataType: ValueType.SignedInteger };
  },
  stringValue(type, properties) {
    return { type, value: properties.value, dataType: ValueType.String };
  },
  jumpIf(type, properties) {
    return { type, address: { type: 'addressValue', value: 0, dataType: ValueType.Address }, ...properties };
  },
  jumpTo(type, properties) {
    return { type, address: { type: 'addressValue', value: 0, dataType: ValueType.Address }, ...properties };
  },
  ioInterrupt(type, properties) {
    return { type, address: { type: 'addressValue', value: 0, dataType: ValueType.Address }, ...properties };
  },
  define(type, properties) {
    return { type, ...properties, size: { type: 'integerValue', value: 0, dataType: ValueType.Integer } };
  },
  // declareIdentifier(type, properties) {
  //   return { type, }
  // },
});
