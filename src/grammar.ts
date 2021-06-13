export default `
Program
  = c:Line* { return c }

Line "statement"
  = Spaces c:Statement NewLine? { return c }

Comment "comment"
  = ('//' [^\\n]+) { return [] }

Statement "statement"
  = DefineTag / SystemInstruction / MemoryInstruction / Operator / IoInstruction / WifiInstruction / I2cInstruction / Comment
SystemInstruction
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump_to / jumpif / delay / sleep

delay = 'delay' Spaces delay:Integer { return [0x02, ..._.numberToInt32(delay)]; }
halt "halt" = 'halt' { return [0xfe]; }
restart = 'restart' { return [0xfc]; }
noop = 'noop' { return [0x01]; }
sleep = 'sleep' Spaces delay:Integer { return [0x3f, ..._.numberToInt32(delay)]; }

jump_to =
  'jump to' Spaces address:Address { return [0x04, ..._.numberToInt32(address)]; } /
  'jump to' Spaces t:Label { return [0x04, _.createPlaceholder(t), 0x00, 0x00, 0x00] }

// --

jumpif = 'jumpif' { return [0x0f]; }
yield = 'yield' { return [0xfa]; }
sysinfo = 'sysinfo' { return [0xfd]; }
debug = 'debug' { return [0xfb]; }
dump = 'dump' { return [0xf9]; }
print = 'print' { return [0x03]; }

Label "label"
  = [a-zA-Z]+ [a-zA-Z0-9_]* { return text() }

DefineTag "new label"
  = '@' label:Label { return _.createReference(label); }

MemoryInstruction
  = memget / memset / push_b / push_i / copy

memget = 'memget' { return [0x05]; }
memset = 'memset' { return [0x06]; }
push_b = 'push_b' { return [0x07]; }
push_i = 'push_i' { return [0x08]; }
copy = 'copy' { return [0x1b]; }

Operator
  = xor / and / or / not / inc / dec / add / sub / mul / div / mod / gt / gte / lt / lte / equal / notequal

gte = 'gte' { return [0x0a]; }
gt = 'gt' { return [0x09]; }
lte = 'lte' { return [0x0c]; }
lt = 'lt' { return [0x0b]; }
equal = 'equal' { return [0x0d]; }
notequal = 'notequal' { return [0x0e]; }
xor = 'xor' { return [0x10]; }
and = 'and' { return [0x11]; }
or = 'or' { return [0x12]; }
not = 'not' Spaces target:Variable Separator operand:Operand { return [0x13, target, operand]; }
inc = 'inc' { return [0x14]; }
dec = 'dec' { return [0x15]; }
add = 'add' { return [0x16]; }
sub = 'sub' { return [0x17]; }
mul = 'mul' { return [0x18]; }
div = 'div' { return [0x19]; }
mod = 'mod' { return [0x1a]; }

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

HexDigit "hexadecimal"
  = [0-9A-Fa-f]

Integer "integer"
	= [1-9][0-9]* { return Number(text()) }

Spaces "space"
  = [ \\t]*

NewLine "new line"
  = [\\n]+

HexByte "HexByte"
  = HexDigit HexDigit { return text() }

Byte "Byte"
  = HexDigit HexDigit { return parseInt(text(), 16) }

Separator "separator"
  = ',' Spaces

Digit "0..9"
  = [0-9]

PinMode "pin mode"
  = mode:[0-3] { return Number(mode) }

Variable "variable"
  = '#' d:Digit { return Number(d) }

Address "address"
  = '0x' a:Byte b:Byte c:Byte d:Byte  { return _.int32ToNumber([d, c, b, a]) }

Pin "pin"
  = 'pin ' pin:Digit { return Number(pin) }

Operand "operand"
  = Variable / Address / Pin
`;
