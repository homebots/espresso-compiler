Program
  = c:Line* { return c }

Line "statement"
  = Spaces c:Statement NewLine? { return c }

Comment "comment"
  = ('//' [^\n]+) { return [] }

Statement "statement"
  = DefineTag / SystemInstruction / MemoryInstruction / Operator / IoInstruction / WifiInstruction / I2cInstruction / Comment
