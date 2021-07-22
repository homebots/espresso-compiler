
Operator = unary_operation / binary_operation / declare_identifier

ASSIGN = '='

unary_operation = not / step
not = 'not' Spaces target:IdentifierValue Separator value:Value { return InstructionNode.create('not', { target, value }) }
step = operator:('inc' / 'dec') Spaces target:IdentifierValue { return InstructionNode.create('unaryOperation', { operator, target }) }

binary_operation = target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces operator:binary_operator Spaces b:Value { return InstructionNode.create('binaryOperation', { operator, target, a, b }) }
binary_operator = '>=' / '>' / '<=' / '<' / '==' / '!=' / 'xor' / 'and' / 'or' / '+' / '-' / '*' / '/' / '%'

declare_identifier =
  dataType:ValueTypeMap Spaces name:Identifier Spaces ASSIGN Spaces value:Value { return InstructionNode.create('declareIdentifier', { name, dataType, value }) } /
  dataType:ValueTypeMap Spaces name:Identifier { return InstructionNode.create('declareIdentifier', { name, dataType, value: null }) }