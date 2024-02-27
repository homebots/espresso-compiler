
SystemInstruction 'system instruction' = Halt / Restart / SystemInfo / Debug / Dump / Noop / Print / JumpTo / JumpIf / Delay / Return / Define

Halt = 'halt' { return InstructionNode.create('halt') }
Return = 'return' { return InstructionNode.create('return') }
End = 'end' { return InstructionNode.create('return') }
Restart = 'restart' { return InstructionNode.create('restart') }
Noop = 'noop' { return InstructionNode.create('noop') }
SystemInfo = 'sysinfo' { return InstructionNode.create('systemInfo') }
Dump = 'dump' { return InstructionNode.create('dump') }
Debug = 'debug' __ value:BooleanValue { return InstructionNode.create('debug', { value }) }
Print = ('print'/'say') __ values:ValueList { return values.map(v => InstructionNode.create('print', { value: v })) }

Delay =
  'delay' __ value:IntegerValue { return InstructionNode.create('delay', { value }) } /
  'sleep' __ value:IntegerValue { return InstructionNode.create('sleep', { value }) } /
  'yield' { return InstructionNode.create('yield') }

JumpTo = label:FunctionName '()' { return InstructionNode.create('jumpTo', { label }) }
JumpIf = 'if' __ condition:Value __ 'then' NewLine __ label:FunctionName '()' { return InstructionNode.create('jumpIf', { condition, label }) }
Define = 'fn' __ label:FunctionName __ body:CodeBlock {
  return [InstructionNode.create('define', { label, body })]
}