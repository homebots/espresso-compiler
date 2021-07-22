
IdentifierValue = value:UseIdentifier { return InstructionNode.create('value', { value, dataType: ValueType.Identifier }) }
PinValue =  value:Pin { return InstructionNode.create('value', { value, dataType: ValueType.Pin }) }
BooleanValue = value:Boolean { return InstructionNode.create('value', { value, dataType: ValueType.Byte }) }
ByteValue = value:Byte { return InstructionNode.create('value', { value, dataType: ValueType.Byte }) }
AddressValue = value:Address { return InstructionNode.create('value', { value, dataType: ValueType.Address }) }
IntegerValue = value:Integer { return InstructionNode.create('value', { value, dataType: ValueType.Integer }) }
SignedIntegerValue = value:SignedInteger { return InstructionNode.create('value', { value, dataType: ValueType.SignedInteger }) }
StringValue = value:String { return InstructionNode.create('value', { value, dataType: ValueType.String }) }
NumberValue = IntegerValue / SignedIntegerValue
Value "value" = IdentifierValue / NumberValue / AddressValue / StringValue / ByteValue / BooleanValue
