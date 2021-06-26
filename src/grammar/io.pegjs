
IoInstruction
  = iowrite / ioread / iomode / iotype / ioallout

iowrite = 'io write' Spaces pin:Pin Separator value:IoValue { return [OpCodes.IoWrite, pin, ...value]; }
ioread = 'io read' Spaces pin:Pin Separator value:IoValue { return [OpCodes.IoRead, pin, ...value]; }
iomode = 'io mode' Spaces pin:Pin Separator mode:PinMode { return [OpCodes.IoMode, pin, mode]; }
iotype = 'io type' Spaces pin:Pin Separator type:Digit { return [OpCodes.IoType, pin, type]; }
ioallout = 'io allout' { return [OpCodes.IoAllOut]; }

IoValue = ByteValue / IdentifierValue