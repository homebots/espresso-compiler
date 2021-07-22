
MemoryInstruction = MemoryGet / MemorySet / MemoryCopy

MemoryCopy = 'copy' Spaces target:AddressValue Separator address:AddressValue { return InstructionNode.create('memoryCopy', { target, address }); }
MemoryGet = 'get' Spaces target:IdentifierValue Separator address:AddressValue { return InstructionNode.create('memoryGet', { target, address }); }
MemorySet = 'set' Spaces target:AddressValue Separator value:Value { return InstructionNode.create('memorySet', { target, value }); }
