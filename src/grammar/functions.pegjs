Functional = DefineFunction / FP

FP =
  e:(DeclareIdentifier / Assign / FunctionCall)* space? { return e.flat(2) }

DefineFunction =
  'fn' space+ name:FunctionName space+ args:FunctionArguments space+ ':' space+ dataType:ValueTypeMap { return InstructionNode.create('function', { name, dataType, args }) }

FunctionName =
  head:[a-zA-Z] tail:[a-z0-9_A-Z]* { return text() }

FunctionArguments =
  '(' head:(@Argument) tail:(space* ',' space* @Argument)* ')' { return [head, ...tail]; }

Argument =
  dataType:ValueTypeMap Spaces name:Identifier

FunctionCall =
  space* name:FunctionName "(" inputs:FunctionCallArgs ")" space* { return InstructionNode.create('call', { name, inputs }) }

FunctionCallArgs =
  head:InputValue tail:(argSeparator space* @InputValue)* { return [ head, ...tail]; }

InputValue "argument"  =
  v:(FunctionCall / Value) { return v }

space "space" =
  " " / [\n\r\t]

paren "parens" =
  "(" / ")"

delimiter "del" =
  paren / space

alpha "character"	=
  [a-z]

argSeparator = ","