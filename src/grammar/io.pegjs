
IoInstruction
  = IoWrite / IoRead / IoMode / IoType / IoAllOutput

IoWrite = 'io_write' Spaces pin:Pin Separator value:IoValue { return InstructionNode.create('ioWrite', { pin, value }) }
IoRead = 'io_read' Spaces target:IdentifierValue Separator pin:Pin { return InstructionNode.create('ioRead', { pin, target }) }
IoMode = 'io_mode' Spaces pin:Pin Separator mode:PinMode { return InstructionNode.create('ioMode', { pin, mode }) }
IoType = 'io_type' Spaces pin:Pin Separator pinType:Digit { return InstructionNode.create('ioType', { pin, pinType: Number(pinType) }) }
IoAllOutput = 'io_all_output' { return InstructionNode.create('ioAllOut') }

IoValue = ByteValue / IdentifierValue / BooleanValue