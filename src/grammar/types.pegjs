HexDigit "hexadecimal"
  = [0-9A-Fa-f]

Integer "integer"
	= [1-9][0-9]* { return Number(text()) }

String "string"
  = "'" string:(!"'" .)* "'"
  // { return string.concat(0) }
    // ["] string:[^']* [^"] { return string.concat(0) }

Spaces "space"
  = [ \t]*

NewLine "new line"
  = [\n]+

HexByte "HexByte"
  = HexDigit HexDigit { return text() }

Byte "Byte"
  = HexDigit HexDigit { return _.bytesFromHex(text()) }

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

True = 'true' { return 1 }
False = 'false' { return 0 }
Boolean = True / False