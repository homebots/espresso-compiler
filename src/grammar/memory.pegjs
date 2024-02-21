
MemoryInstruction = MemoryGet / MemorySet

MemoryGet = 'mem_get' __ target:IdentifierValue Separator address:AddressValue { return InstructionNode.create('memoryGet', { target, address }); }
MemorySet = 'mem_set' __ target:AddressValue Separator value:Value { return InstructionNode.create('memorySet', { target, value }); }
