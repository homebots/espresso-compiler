
IoInstruction = IoWrite / IoRead / IoMode / IoType / IoAllOutput / IoAllInput / IoInterrupt / IoInterruptToggle
IoValue = ByteValue / IdentifierValue / BooleanValue

IoWrite =
  'io_write' __ pin:PinValue Separator value:IoValue { return InstructionNode.create('ioWrite', { pin, value }) } /
  pin:PinValue __ '<-' __ value:IoValue { return InstructionNode.create('ioWrite', { pin, value }) }

IoRead =
  'io_read' __ target:IdentifierValue Separator pin:PinValue { return InstructionNode.create('ioRead', { pin, target }) } /
  target:IdentifierValue __ '<-' __ pin:PinValue { return InstructionNode.create('ioRead', { pin, target }) }

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
IoAllInput = 'io_all_input' { return InstructionNode.create('ioAllIn') }

IoInterrupt = 'when' __ pin:PinValue __ 'is' __ value:BooleanValue __ label:FunctionName '()' {
  // interrupt edge
  value.value = value.value ? 5 : 4;
  return InstructionNode.create('ioInterrupt', { pin, value, label })
}

IoInterruptToggle = 'interrupts' __ value:BooleanValue { return InstructionNode.create('ioInterruptToggle', { value }) }
