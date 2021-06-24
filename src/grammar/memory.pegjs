
MemoryInstruction
  = memget / memset / copy
  // push_b / push_i

memget = 'memget' Spaces IdentifierValue Separator Value { return [0x05]; }
memset = 'memset' Spaces MemoryWriteValue Separator Value { return [0x06]; }
// push_b = 'push_b' { return [0x07]; }
// push_i = 'push_i' { return [0x08]; }
copy = 'copy' IdentifierValue Value { return [0x1b]; }

MemoryWriteValue = AddressValue / PinValue
