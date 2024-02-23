
Program = c:Line* { return c }
Line "statement" = __ c:Statement StatementSeparator { return c }
StatementSeparator "EOL" = NewLine?
Statement "statement" =
SystemInstruction /
MemoryInstruction /
Operator /
IoInstruction /
WifiInstruction /
Comment

// / I2cInstruction

Comment "comment" = ('//' [^\n]+) { return [] }