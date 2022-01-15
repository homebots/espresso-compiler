Program = Spaces head:Statement? tail:(Spaces StatementSeparator Spaces @Statement)* { return [head, ... tail.map(t => t[3])]; }
StatementSeparator = NewLine
Comment "comment" = '//' [^\n]+ { return [] }

Statement "statement" =
  Comment /
  DefineLabel /
  SystemInstruction /
  MemoryInstruction /
  Operator /
  IoInstruction /
  Spaces