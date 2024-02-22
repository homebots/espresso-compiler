
IoInstruction
  = IoWrite / IoRead / IoMode / IoType / IoAllOutput

IoWrite = 'io_write' __ pin:PinValue Separator value:IoValue { return InstructionNode.create('ioWrite', { pin, value }) }
IoRead = 'io_read' __ target:IdentifierValue Separator pin:PinValue { return InstructionNode.create('ioRead', { pin, target }) }

IoMode = 'io_mode' __ pin:PinValue Separator mode:PinMode {
  return InstructionNode.create('ioMode', {
    pin,
    mode: InstructionNode.create('byteValue', { value: Number(mode) })
  })
}

IoType = 'io_type' __ pin:PinValue Separator pinType:Digit {
  return InstructionNode.create('ioType', {
    pin,
    pinType: InstructionNode.create('byteValue', { value: Number(pinType) })
  })
}

IoAllOutput = 'io_all_output' { return InstructionNode.create('ioAllOut') }

IoValue = ByteValue / IdentifierValue / BooleanValue