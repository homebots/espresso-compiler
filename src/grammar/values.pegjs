
// values
NullValue = 'null' { return InstructionNode.create('nullValue', {}) }
IdentifierValue = value:UseIdentifier { return InstructionNode.create('identifierValue', { value }) }
PinValue =  value:Pin { return InstructionNode.create('pinValue', { value }) }
BooleanValue = value:Boolean { return InstructionNode.create('booleanValue', { value }) }
ByteValue = value:Byte { return InstructionNode.create('byteValue', { value }) }
AddressValue = value:Address { return InstructionNode.create('addressValue', { value }) }
IntegerValue = value:Integer { return InstructionNode.create('integerValue', { value }) }
SignedIntegerValue = value:SignedInteger { return InstructionNode.create('signedIntegerValue', { value }) }
StringValue = value:String { return InstructionNode.create('stringValue', { value }) }
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
