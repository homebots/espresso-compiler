HexDigit "hexadecimal"
  = [0-9A-Fa-f]

HexByte "HexByte"
  = HexDigit HexDigit { return text() }

Byte "Byte"
  = HexDigit HexDigit { return parseInt(text(), 16) }

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

True
  = 'true' { return 1 }

False
  = 'false' { return 0 }

Boolean
  = True / False

Integer "integer"
  = [1-9][0-9]* { return Number(text()) }

SignedInteger
  = '-' int:Integer { return -1 * int }

String "string"
  = "'" string:(!"'" .)* "'" { return string.map(s => s[1]) }

Address "address"
  = '0x' a:Byte b:Byte c:Byte d:Byte { return [d, c, b, a] }

Pin "pin"
  = 'pin ' pin:Digit { return new T.PinValue(Number(pin)) }

Identifier "identifier"
  = '$' head:IdentifierChar tail:IdentifierChar* { return text(); }

IdentifierChar
  = Alphanumeric
  / "$"
  / "_"

IdentifierValue = name:Identifier  { return T.IdentifierValue.create(name) }
ByteValue = byte:Byte { return T.ByteValue.create(byte) } / pin:Pin { return T.PinValue.create(pin) }
AddressValue = address:Address { return T.AddressValue.create(address) }
IntegerValue = number:Integer { return T.IntegerValue.create(number) }
SignedIntegerValue = number:SignedInteger { return T.SignedIntegerValue.create(number) }
NumberValue = IntegerValue / SignedIntegerValue
StringValue = string:String { return T.StringValue.create(string) }

Value "identifier, address or IO pin"
  = IdentifierValue / ByteValue / AddressValue / NumberValue / StringValue
