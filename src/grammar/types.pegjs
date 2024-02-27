
HexDigit "hexadecimal" = [0-9a-f]
HexByte "byte hex" = HexDigit HexDigit { return text() }
Byte "Byte" = a:HexDigit b:HexDigit? 'h' { return parseInt(a + b, 16) }
Space = [ \t]
__ "spaces" = Space*
NewLine "new line" = [\n]+
Separator "separator" = ',' __
Equals = '='
Digit "0..9" = [0-9]
NonZeroDigit "1..9" = [1-9]
Alpha "a-z" = [a-z]i
Alphanumeric "a-z or 0-9" = [a-z0-9]i
True = ('true' / '1' / 'on') { return 1 }
False = ('false' / '0' / 'off') { return 0 }
Boolean "boolean" = True / False
Integer "integer" = "0" { return 0 } / NonZeroDigit (!Space Digit)* { return parseInt(text()) }
SignedInteger "signedInteger" = signal:('-'/'+') int:Integer { return signal + String(int) }
String "string" = SingleQuoteString / DoubleQuoteString
SingleQuoteString = "'" string:(!"'" .)* "'" { return string.map(s => s[1]) }
DoubleQuoteString = '"' string:(!'"' .)* '"' { return string.map(s => s[1]) }
Address "address" = '0x' a:HexByte b:HexByte c:HexByte d:HexByte { return parseInt(a + b + c + d, 16) }
Pin "pin" = ('pin ' / '#') pin:(Digit / '10' / '11' / '12' / '13' / '14' / '15') { return Number(pin) }
FunctionName = [a-z] [a-zA-Z0-9_]* { return text() }
Identifier "identifier" = '$' head:IdentifierChar tail:IdentifierChar* { return text(); }
IdentifierChar = Alphanumeric / "$" / "_"
UseIdentifier = name:Identifier { return InstructionNode.create('useIdentifier', { name }) }

PinMode "pin mode" = PinModeInputPullUp / PinModeOpenDrain / PinModeInput / PinModeOutput

PinModeInput = ('input' / '0') { return 0 }
PinModeOutput = ('output' / '1' ) { return 1 }
PinModeOpenDrain = ('open-drain' / '2') { return 2 }
PinModeInputPullUp = ('pull-up' / '3') { return 3 }

ValueTypeMap =
  'byte' { return ValueType.Byte } /
  'boolean' { return ValueType.Byte } /
  'address' { return ValueType.Address } /
  'uint' { return  ValueType.Integer } /
  'int' { return ValueType.SignedInteger } /
  'string' { return ValueType.String }

InterruptTriggerMap =
  'disabled' { return 0 } /
  'rising' { return 1 } /
  'falling' { return 2 } /
  'changing' { return 3 } /
  'off' { return 4 } /
  'on' { return 5 }

CodeBlock =
  '{}' { return [InstructionNode.create('return')] } /
  '{' NewLine body:Line* __ '}' { return [...body, InstructionNode.create('return')].flat(2) }