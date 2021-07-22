
HexDigit "hexadecimal" = [0-9A-Fa-f]
HexByte "byte hex" = HexDigit HexDigit { return text() }
Byte "Byte" = '0x' HexDigit HexDigit { return parseInt(text(), 16) }
Space = [ \t]
Spaces "space" = Space*
NewLine "new line" = [\n]+
Separator "separator" = ',' Spaces
Digit "0..9" = [0-9]
NonZeroDigit "1..9" = [1-9]
Alpha "a-z" = [a-z]i
Alphanumeric "a-z or 0-9" = [a-z]i
PinMode "pin mode" = mode:[0-3] { return Number(mode) }
True = ('true' / '1') { return 1 }
False = ('false' / '0') { return 0 }
Boolean = True / False
Integer "integer" = "0" { return 0 } / NonZeroDigit (!Space Digit)* { return parseInt(text()) }
SignedInteger = '-' int:Integer { return -1 * int }
String "string" = "'" string:(!"'" .)* "'" { return string.map(s => s[1]) }
Address "address" = '0x' a:HexByte b:HexByte c:HexByte d:HexByte { return [d, c, b, a] }
Pin "pin" = 'pin ' pin:(Digit / '10' / '11' / '12' / '13' / '14' / '15') { return Number(pin) }
LabelText = [a-z] [a-zA-Z0-9_]* { return text() }
DefineLabel = '@' label:LabelText { return InstructionNode.create('label', { label }) }
Label = label:LabelText { return InstructionNode.create('label', { label }) }
Identifier "identifier" = '$' head:IdentifierChar tail:IdentifierChar* { return text(); }
IdentifierChar = Alphanumeric / "$" / "_"
UseIdentifier = name:Identifier { return InstructionNode.create('useIdentifier', { name }) }

ValueTypeMap =
  'byte' { return ValueType.Byte } /
  'address' { return ValueType.Address } /
  'uint' { return  ValueType.Integer } /
  'int' { return ValueType.SignedInteger } /
  'string' { return ValueType.String }

