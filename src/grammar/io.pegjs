
IoInstruction
  = IoWrite / IoRead / IoMode / IoType / IoAllOutput

IoWrite = 'io_write' __ pin:PinValue Separator value:IoValue { return InstructionNode.create('ioWrite', { pin, value }) }
IoRead = 'io_read' __ target:IdentifierValue Separator pin:PinValue { return InstructionNode.create('ioRead', { pin, target }) }

IoMode = 'io_mode' __ pin:Pin Separator mode:PinMode {
  return InstructionNode.create('ioMode', {
    pin: InstructionNode.create('byteValue', { value: Number(pin) }),
    mode: InstructionNode.create('byteValue', { value: Number(mode) })
  })
}

IoType = 'io_type' __ pin:Pin Separator pinType:Digit {
  return InstructionNode.create('ioType', {
    pin: InstructionNode.create('byteValue', { value: Number(pin) }),
    pinType: InstructionNode.create('byteValue', { value: Number(pinType) })
  })
}

IoAllOutput = 'io_all_output' { return InstructionNode.create('ioAllOut') }

IoValue = ByteValue / IdentifierValue / BooleanValue