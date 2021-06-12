
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
