
// operators
Operator = BinaryOperation / UnaryOperation / DeclareIdentifier / Assign

Equals = '='
Assign = target:IdentifierValue __ Equals __ value:Value { return InstructionNode.create('assign', { target, value }) }

UnaryOperation = Not / Step
Not = target:IdentifierValue __ Equals __ ('not'/'!') __ value:Value { return InstructionNode.create('not', { target, value }) }
Step = operator:('inc' / 'dec') __ target:IdentifierValue { return InstructionNode.create('unaryOperation', { operator, target }) }

BinaryOperation = target:IdentifierValue __ Equals __ a:Value __ operator:BinaryOperator __ b:Value { return InstructionNode.create('binaryOperation', { operator, target, a, b }) }
BinaryOperator = '>=' / '>' / '<=' / '<' / '==' / '!=' / 'xor' / 'and' / 'or' / '+' / '-' / '*' / '/' / '%'

DeclareIdentifier = dataType:ValueTypeMap __ name:Identifier __ Equals __ value:Value { return InstructionNode.create('declareIdentifier', { name, dataType, value }) }

SystemInstruction 'system instruction' = Halt / Restart / SystemInfo / Debug / Dump / Noop / Print / JumpTo / JumpIf / Delay

Halt = 'halt' { return InstructionNode.create('halt') }
Restart = 'restart' { return InstructionNode.create('restart') }
Noop = 'noop' { return InstructionNode.create('noop') }
SystemInfo = 'sysinfo' { return InstructionNode.create('systemInfo') }
Dump = 'dump' { return InstructionNode.create('dump') }
Debug = 'debug' __ value:BooleanValue { return InstructionNode.create('debug', { value }) }
Print = 'print' __ values:ValueList { return values.map(v => InstructionNode.create('print', { value:v })) }

Delay =
  'delay' __ value:IntegerValue { return InstructionNode.create('delay', { value }) } /
  'sleep' __ value:IntegerValue { return InstructionNode.create('sleep', { value }) } /
  'yield' { return InstructionNode.create('yield') }

JumpTo =
  'jump' __ 'to' __ address:AddressValue { return InstructionNode.create('jumpTo', { address }) } /
  'jump' __ 'to' __ label:Label { return InstructionNode.create('jumpTo', { label }) } /
  label:Label '()' { return InstructionNode.create('jumpTo', { label }) }

JumpIf =
  'if' __ condition:Value __ 'then' __ 'jump' __ 'to' __ address:AddressValue { return InstructionNode.create('jumpIf', { condition, address }) } /
  'if' __ condition:Value __ 'then' __ 'jump' __ 'to' __ label:Label { return InstructionNode.create('jumpIf', { condition, label }) } /
  'if' __ condition:Value __ 'then' __ label:Label '()' { return InstructionNode.create('jumpIf', { condition, label }) }

