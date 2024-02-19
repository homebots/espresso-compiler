
// operators
Operator = BinaryOperation / UnaryOperation / DeclareIdentifier / Assign

ASSIGN = '='
Assign = target:IdentifierValue Spaces ASSIGN Spaces value:Value { return InstructionNode.create('assign', { target, value }) }

UnaryOperation = Not / Step
Not = target:IdentifierValue Spaces ASSIGN Spaces ('not'/'!') Spaces value:Value { return InstructionNode.create('not', { target, value }) }
Step = operator:('inc' / 'dec') Spaces target:IdentifierValue { return InstructionNode.create('unaryOperation', { operator, target }) }

BinaryOperation = target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces operator:BinaryOperator Spaces b:Value { return InstructionNode.create('binaryOperation', { operator, target, a, b }) }
BinaryOperator = '>=' / '>' / '<=' / '<' / '==' / '!=' / 'xor' / 'and' / 'or' / '+' / '-' / '*' / '/' / '%'

DeclareIdentifier = dataType:ValueTypeMap Spaces name:Identifier Spaces ASSIGN Spaces value:Value { return InstructionNode.create('declareIdentifier', { name, dataType, value }) }

SystemInstruction 'system instruction' = Halt / Restart / SystemInfo / Debug / Dump / Noop / Print / JumpTo / JumpIf / Delay

Halt = 'halt' { return InstructionNode.create('halt') }
Restart = 'restart' { return InstructionNode.create('restart') }
Noop = 'noop' { return InstructionNode.create('noop') }
SystemInfo = 'sysinfo' { return InstructionNode.create('systemInfo') }
Dump = 'dump' { return InstructionNode.create('dump') }
Debug = 'debug' Spaces value:BooleanValue { return InstructionNode.create('debug', { value }) }
Print = 'print' Spaces values:ValueList { return values.map(v => InstructionNode.create('print', { value:v })) }

Delay =
  'delay' Spaces value:IntegerValue { return InstructionNode.create('delay', { value }) } /
  'sleep' Spaces value:IntegerValue { return InstructionNode.create('sleep', { value }) } /
  'yield' { return InstructionNode.create('yield') }

JumpTo =
  'jump' Spaces 'to' Spaces address:AddressValue { return InstructionNode.create('jumpTo', { address }) } /
  'jump' Spaces 'to' Spaces label:Label { return InstructionNode.create('jumpTo', { label }) } /
  label:Label '()' { return InstructionNode.create('jumpTo', { label }) }

JumpIf =
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces address:AddressValue { return InstructionNode.create('jumpIf', { condition, address }) } /
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces label:Label { return InstructionNode.create('jumpIf', { condition, label }) } /
  'if' Spaces condition:Value Spaces 'then' Spaces label:Label '()' { return InstructionNode.create('jumpIf', { condition, label }) }

