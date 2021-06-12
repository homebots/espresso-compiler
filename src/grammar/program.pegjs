Program
  = c:Line*

Line "statement"
  = Spaces c:Statement NewLine? { return c } / Comment

Comment "comment"
  = ('//' [^\\n]+) { return [] }

Statement "statement"
  = DefineTag / SystemInstruction / MemoryInstruction / Operator / IoInstruction / WifiInstruction / I2cInstruction

DefineTag "new label"
  = '@' label:Label { return _.createLabel(label); }
