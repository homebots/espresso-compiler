HexDigit "hexadecimal"
  = [0-9A-Fa-f]

Integer "integer"
	= [1-9][0-9]* { return Number(text()) }

String "string"
  = "'" string:(!"'" .)* "'" { return _.toBinaryString(string.map(s => s[1])) }

HexByte "HexByte"
  = HexDigit HexDigit { return text() }

Byte "Byte"
  = HexDigit HexDigit { return _.bytesFromHex(text()) }

Spaces "space"
  = [ \t]*

NewLine "new line"
  = [\n]+

Separator "separator"
  = ',' Spaces

Digit "0..9"
  = [0-9]

Alpha "a-z"
  = [a-z]i

Alphanumeric "a-z or 0-9"
  = [a-z]i

PinMode "pin mode"
  = mode:[0-3] { return Number(mode) }

Address "address"
  = '0x' a:Byte b:Byte c:Byte d:Byte  { return _.toAddress([d, c, b, a]) }
  // = '0x' a:Byte b:Byte c:Byte d:Byte  { return _.int32ToNumber([d, c, b, a]) }

Pin "pin"
  = 'pin ' pin:Digit { return _.toPinValue(Number(pin)) }

True
  = 'true' { return 1 }

False
  = 'false' { return 0 }

Boolean
  = True / False

// Variable "variable"
//   = '#' d:Digit { return Number(d) }

Identifier "identifier"
  = '$' head:IdentifierChar tail:IdentifierChar* { return _.toIdentifierValue(head + tail.join('')); }

IdentifierChar
  = Alphanumeric
  / "$"
  / "_"

Value "identifier, address or IO pin"
  = Identifier / Address / Pin
