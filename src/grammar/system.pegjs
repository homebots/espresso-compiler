
SystemInstruction 'system instruction' = Halt / Restart / SystemInfo / Debug / Dump / Noop / Print / JumpTo / JumpIf / Delay

Halt = 'halt' { return InstructionNode.create('halt') }
Restart = 'restart' { return InstructionNode.create('restart') }
Noop = 'noop' { return InstructionNode.create('noop') }
SystemInfo = 'sysinfo' { return InstructionNode.create('systemInfo') }
Dump = 'dump' { return InstructionNode.create('dump') }
Debug = 'debug' Spaces value:Boolean { return InstructionNode.create('debug', { value }) }
Print = 'print' Spaces value:Value { return InstructionNode.create('print', { value }) }

Delay =
  'delay' Spaces value:IntegerValue { return InstructionNode.create('delay', { value }) } /
  'sleep' Spaces value:IntegerValue { return InstructionNode.create('sleep', { value }) } /
  'yield' Spaces value:IntegerValue { return InstructionNode.create('yield', { value }) }

JumpTo =
  'jump' Spaces 'to' Spaces address:AddressValue { return InstructionNode.create('jumpTo', { address }) } /
  'jump' Spaces 'to' Spaces 'label' Spaces label:Label { return InstructionNode.create('jumpTo', { label }) }

JumpIf =
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces 'label' Spaces label:Label { return InstructionNode.create('jumpIf', { condition, label }) }

