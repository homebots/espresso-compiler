
IoInstruction
  = iowrite / ioread / iomode / iotype / ioallout

iowrite = 'io write' Spaces Pin Separator Value { return [0x31]; }
ioread = 'io read' Spaces Pin Separator Value { return [0x32]; }
iomode = 'io mode' Spaces Pin Separator PinMode { return [0x35]; }
iotype = 'io type' Spaces Pin Separator Digit { return [0x36]; }
ioallout = 'io allout' { return [0x37]; }
