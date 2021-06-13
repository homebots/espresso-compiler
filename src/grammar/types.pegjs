
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
