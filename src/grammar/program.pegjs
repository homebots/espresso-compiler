Program = head:Statement? tail:(StatementSeparator Statement)* { return [head].concat(tail.map(t => t[1])); }
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