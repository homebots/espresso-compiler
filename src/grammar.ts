export default `
Program
  = c:Line*

Line "statement"
  = Spaces c:Statement NewLine? { return c } / Comment

Comment "comment"
  = ('//' [^\\n]+) { return [] }

Statement "statement"
  = DefineTag / SystemInstruction / MemoryInstruction / Operator / IoInstruction / WifiInstruction / I2cInstruction

DefineTag "new label"
  = '@' label:Label { return _.createLabel(label); }

HexDigit "hexadecimal"
  = [0-9A-Fa-f]

Integer "integer"
	= [1-9][0-9]* { return Number(text()) }

Label "label"
  = [a-zA-Z]+ [a-zA-Z0-9_]* { return text() }

Spaces "space"
  = [ \\t]*

NewLine "new line"
  = [\\n]+

Address "address"
  = '0x' h:(Byte Byte Byte Byte) { return h }

Byte "Byte"
  = HexDigit HexDigit { return parseInt(text(), 16) }

Separator "separator"
  = ',' Spaces

Digit "0..9"
  = [0-9]

PinMode "pin mode"
  = mode:[0-3] { return Number(mode) }

Slot "slot"
  = '#' d:Digit { return Number(d) }

Pin "pin"
  = 'pin ' pin:Digit { return Number(pin) }

Operand "operand"
  = Slot / Address / Pin
SystemInstruction
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump / jumpif / delay_v / delay / sleep

halt "halt" = 'halt' { return [0xfe]; }
restart = 'restart' { return [0xfc]; }
sysinfo = 'sysinfo' { return [0xfd]; }
debug = 'debug' { return [0xfb]; }
dump = 'dump' { return [0xf9]; }
noop = 'noop' { return [0x01]; }
yield = 'yield' { return [0xfa]; }
print = 'print' { return [0x03]; }
jump = 'jump' Spaces a:Address { return [0x04, a]; } / 'jump to' Spaces t:Label { return [0x04, _.getLabel(t)] }
jumpif = 'jumpif' { return [0x0f]; }
delay = 'delay' Spaces delay:Integer { return [0x02, ..._.toInt32(delay)]; }
delay_v = 'delay_v' { return [0x1c]; }
sleep = 'sleep' { return [0x3f]; }

MemoryInstruction
  = memget / memset / push_b / push_i / copy

memget = 'memget' { return [0x05]; }
memset = 'memset' { return [0x06]; }
push_b = 'push_b' { return [0x07]; }
push_i = 'push_i' { return [0x08]; }
copy = 'copy' { return [0x1b]; }

IoInstruction
  = iowrite / ioread / iomode / iotype / ioallout

iowrite = 'io write' Spaces Pin Separator Operand { return [0x31]; }
ioread = 'io read' Spaces Pin Separator Operand { return [0x32]; }
iomode = 'io mode' Spaces Pin Separator PinMode { return [0x35]; }
iotype = 'io type' Spaces Pin Separator Digit { return [0x36]; }
ioallout = 'io allout' { return [0x37]; }

WifiInstruction
  = wificonnect / wifidisconnect / wifistatus / wifilist

wificonnect = 'net connect' { return [0x3a]; }
wifidisconnect = 'net disconnect' { return [0x3b]; }
wifistatus = 'net status' { return [0x3c]; }
wifilist = 'wifilist' { return [0x3e]; }
I2cInstruction
  = i2setup / i2start / i2stop / i2write / i2read / i2setack / i2getack / i2find / i2writeack / i2writeack_b

i2setup = 'i2setup' { return [0x40]; }
i2start = 'i2start' { return [0x41]; }
i2stop = 'i2stop' { return [0x42]; }
i2write = 'i2write' { return [0x43]; }
i2read = 'i2read' { return [0x44]; }
i2setack = 'i2setack' { return [0x45]; }
i2getack = 'i2getack' { return [0x46]; }
i2find = 'i2find' { return [0x48]; }
i2writeack = 'i2writeack' { return [0x49]; }
i2writeack_b = 'i2writeack_b' { return [0x4a]; }
`;
