
MemoryInstruction = MemoryGet / MemorySet

MemoryGet = 'mem_get' Spaces target:IdentifierValue Separator address:AddressValue { return InstructionNode.create('memoryGet', { target, address }); }
MemorySet = 'mem_set' Spaces target:AddressValue Separator value:Value { return InstructionNode.create('memorySet', { target, value }); }
