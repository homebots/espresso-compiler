
SystemInstruction 'system instruction' = halt / restart / sysinfo / debug / dump / noop / print / jump_to / jump_if / delay

halt = 'halt' { return InstructionNode.create('halt') }
restart = 'restart' { return InstructionNode.create('restart') }
noop = 'noop' { return InstructionNode.create('noop') }
sysinfo = 'sysinfo' { return InstructionNode.create('sys_info') }
dump = 'dump' { return InstructionNode.create('dump') }
debug = 'debug' Spaces value:Boolean { return InstructionNode.create('debug', { value }) }
print = 'print' Spaces value:Value { return InstructionNode.create('print', { value }) }

delay =
  'delay' Spaces value:IntegerValue { return InstructionNode.create('delay', { value }) } /
  'sleep' Spaces value:IntegerValue { return InstructionNode.create('sleep', { value }) } /
  'yield' Spaces value:IntegerValue { return InstructionNode.create('yield', { value }) }

jump_to =
  'jump' Spaces 'to' Spaces address:AddressValue { return InstructionNode.create('jump_to', { address }) } /
  'jump' Spaces 'to' Spaces label:Label { return InstructionNode.create('jump_to', { label }) }

jump_if =
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces label:Label { return InstructionNode.create('jump_if', { condition, label }) }

