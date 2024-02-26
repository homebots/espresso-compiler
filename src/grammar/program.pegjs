
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

Comment "comment" = ('//' [^\n]+) { return [] }