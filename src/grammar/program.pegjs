
Program = c:Line* { return c }
Line "statement" = Spaces c:Statement StatementSeparator { return c }
StatementSeparator = NewLine? / ';'?

// Function
//   = 'fn' Spaces label:Label args:Arguments body:Block { return T.FunctionBody.create(label, args, body) }

// Arguments
//   = '(' args:DeclareIdentifier* ')' { return args }

// FunctionCall
//   = label:Label '(' args:Value* ')' { return T.FunctionCall.create(label, args) }

// Block
//   = '{' NewLine? lines:Line* '}' { return T.Block.create(lines) }


Statement "statement" =
DefineLabel /
SystemInstruction /
MemoryInstruction /
Operator /
IoInstruction /
Comment

 // / WifiInstruction
 // / I2cInstruction


Comment "comment" = ('//' [^\n]+) { return InstructionNode.create('comment') }