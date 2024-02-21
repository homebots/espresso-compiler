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
