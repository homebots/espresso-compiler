
// values
IdentifierValue = value:UseIdentifier { return InstructionNode.create('identifierValue', { value, dataType: ValueType.Identifier }) }
PinValue =  value:Pin { return InstructionNode.create('byteValue', { value, dataType: ValueType.Pin }) }
BooleanValue = value:Boolean { return InstructionNode.create('byteValue', { value, dataType: ValueType.Byte }) }
ByteValue = value:Byte { return InstructionNode.create('byteValue', { value, dataType: ValueType.Byte }) }
AddressValue = value:Address { return InstructionNode.create('numberValue', { value, dataType: ValueType.Address }) }
IntegerValue = value:Integer { return InstructionNode.create('numberValue', { value, dataType: ValueType.Integer }) }
SignedIntegerValue = value:SignedInteger { return InstructionNode.create('numberValue', { value, dataType: ValueType.SignedInteger }) }
StringValue = value:String { return InstructionNode.create('stringValue', { value, dataType: ValueType.String }) }
NullValue = 'null' { return InstructionNode.create('byteValue', { value: 0, dataType: ValueType.Null }) }
NumberValue = IntegerValue / SignedIntegerValue

Value "value" = IdentifierValue / ByteValue / AddressValue / NumberValue / StringValue / BooleanValue / NullValue
IntrinsicValue = ByteValue / NumberValue / StringValue / BooleanValue / NullValue
ValueArg "arg" = arg:(Value Separator?) { return arg[0] }
ValueList "values" = values:ValueArg* { return values }

ValueTypeMap =
  'byte' { return ValueType.Byte } /
  'boolean' { return ValueType.Byte } /
  'address' { return ValueType.Address } /
  'uint' { return  ValueType.Integer } /
  'int' { return ValueType.SignedInteger } /
  'string' { return ValueType.String }
